import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma:PrismaService,
        private readonly jwtService:JwtService
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
        
        //JWT payload 
        const payload={
            sub:user.id,
            email:user.email
        }

        //Genrate token

        const accessToken= await this.jwtService.signAsync(payload)

        return{
            message:'Login Successful',
            access_token:accessToken,
            user:{
                id:user.id,
                name:user.name,
                email:user.email,
                age:user.age
            }
        }
    }
}
