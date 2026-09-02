import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma:PrismaService,
        private readonly jwtService:JwtService,
        private readonly configService:ConfigService
    ){}

    async register(registerDto:RegisterDto){
        const existingUser= await this.prisma.user.findUnique({
            where:{
                email:registerDto.email
            }
        })
        if(existingUser){
            throw new ConflictException(
                'Email already registered'
            )
        }
        const hashedPassword = await bcrypt.hash(
            registerDto.password,
            10
        )

        const user = await this.prisma.user.create({
            data:{
                name:registerDto.name,
                email:registerDto.email,
                age:registerDto.age,
                password:hashedPassword
            }
        })

        //never return the password 
        const {password, ...result}=user
        return result
    }

    async login(loginDto:LoginDto){
        //find user 
        const user= await this.prisma.user.findUnique({
            where:{
                email:loginDto.email
            }
        })
        if(!user){
            throw new UnauthorizedException(
                'Invalid email or password'
            )
        }
        // Compare passwords 
        const isPasswordValid= await bcrypt.compare(
            loginDto.password,
            user.password
        )
        if(!isPasswordValid){
            throw new UnauthorizedException(
                'Invalid email or password'
            )
        }
        
        // //JWT payload 
        // const payload={
        //     sub:user.id,
        //     email:user.email,
        //     role:user.role
            
        // }

        // //Genrate token

        // const accessToken= await this.jwtService.signAsync(payload)

        const {accessToken,refreshToken}= await this.genrateTokens(
            user.id,
            user.email,
            user.role
        )

        await this.prisma.user.update({
            where:{
                id:user.id
            },
            data:{
                refreshToken:refreshToken
            }
        })

        return{
            message:'Login Successful',
            access_token:accessToken,
            refresh_token:refreshToken,
            user:{
                id:user.id,
                name:user.name,
                email:user.email,
                age:user.age,
                role:user.role
            }
        }
    }

    async getProfile(userId:number){
        const user = await this.prisma.user.findUnique({
            where:{
                id:userId
            },
            select:{
                id:true,
                name:true,
                email:true,
                age:true,
                createdAt:true,
                updatedAt:true
            }
        })
        if(!user){
            throw new UnauthorizedException('user not found')
        }
        return user
    }

    //Creat and store refresh Token
    
    async genrateTokens(
        userId: number,
        email: string,
        role: string
    ) {
        const payload = {
            sub: userId,
            email,
            role
        };

        const accessToken = await this.jwtService.signAsync(
            payload,
            {
                secret: this.configService.get<string>('JWT_SECRET'),
                expiresIn: '1d'
            }
        );

        const refreshToken = await this.jwtService.signAsync(
            payload,
            {
                secret: this.configService.get<string>('JWT_REFRESH'),
                expiresIn: '7d'
            }
        );

        return {
            accessToken,
            refreshToken
        };
    }

    async refreshTokens(refreshToken:string){
        try{
            const payload = await this.jwtService.verifyAsync(
                refreshToken,
                {
                    secret: this.configService.get<string>('JWT_REFRESH')
                }
            );

            const user = await this.prisma.user.findUnique({
                where:{id: payload.sub,}
            })

            if(!user||user.refreshToken!==refreshToken){
                throw new UnauthorizedException('Invalid or expired refresh Token')
            }

            const tokens= await this.genrateTokens(
                user.id,
                user.email,
                user.role
            )

            await this.prisma.user.update({
                where:{
                    id:user.id
                },
                data:{
                    refreshToken:tokens.refreshToken
                }
            })

            return {
                message:'Tokens refreshed successfully',
                access_token:tokens.accessToken,
                refresh_token:tokens.refreshToken,
            }
        }catch{
            throw new UnauthorizedException(
                'Invalid or expired refresh Token'
            )
        }
    }
}
