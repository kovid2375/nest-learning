import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/mail.service';
import * as crypto from 'crypto'
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { verifyOtpDto } from './dto/verify-otp.dto';
@Injectable()
export class AuthService {
    constructor(
        private readonly prisma:PrismaService,
        private readonly jwtService:JwtService,
        private readonly configService:ConfigService,
        private readonly mailService:MailService
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

        const verificationToken = crypto.randomBytes(32).toString('hex')

        const user = await this.prisma.user.create({
            data:{
                name:registerDto.name,
                email:registerDto.email,
                age:registerDto.age,
                password:hashedPassword,
                verificationToken
            }
        })
        const verificationUrl=`http://localhost:3000/auth/verify-email?token=${verificationToken}`

        await this.mailService.sendMail(
            user.email,
            'Email Verification',
            `
                Hello ${user.name},\n\n,
                Thank you for registering with our app.\n\n,
                Please click on the link below to verify your email address:\n\n,
                ${verificationUrl}\n\n,
                If you did not create this account, please ignore this email.\n\n,
                Best regards,\n,
                Your App Team
            `
        )

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

            if (!user || !user.refreshToken) {
                throw new UnauthorizedException(
                    'Invalid or expired refresh Token'
                );
            }

            const isRefreshTokenValid= await bcrypt.compare(
                refreshToken,
                user.refreshToken
            )
            if(!isRefreshTokenValid){
                throw new UnauthorizedException(
                    'Invalid or expired refresh Token'
                )
            }
            const tokens= await this.genrateTokens(
                user.id,
                user.email,
                user.role
            )

            const hashedRefreshToken=await bcrypt.hash(
                refreshToken,
                10
            )

            await this.prisma.user.update({
                where:{
                    id:user.id
                },
                data:{
                    refreshToken:hashedRefreshToken
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

    async logout(userId:number){
        await this.prisma.user.update({
            where:{
                id:userId,
            },
            data:{
                refreshToken:null
            }
        })
        return{
            message:"LogOut Successful"
        }
    }

    async verifyEmail(token:string){
        const user = await this.prisma.user.findFirst({
            where:{
                verificationToken:token,
            }
        })
        if(!user){
            throw new UnauthorizedException(
                `Invalid verification token`,
            )
        }

        await this.prisma.user.update({
            where:{
                id:user.id,
            },
            data:{
                isEmailVerified:true,
                verificationToken:null
            }
        })
        return{
            message:'Email verified successfully'
        }
    }
    async forgotpassword(forgotpasswordDto:ForgotPasswordDto){
        const user= await this.prisma.user.findUnique({
            where:{
                email:forgotpasswordDto.email
            }
        })
        //Important : dont revel where an email exists

        if(!user){
            return{
                message:"if account exist with this email , a reset link has been sent"
            }
        }

        const resetToken= crypto.randomBytes(32).toString('hex')
        const resetPasswordExpires=new Date(
            Date.now()+15*60*1000,
        )
        await this.prisma.user.update({
            where:{
                id:user.id
            },
            data:{
                resetPasswordToken:resetToken,
                resetPasswordExpires
            }
        })
        const resetUrl=`http://localhost:3000/auth/reset-password?token=${resetToken}`
        await this.mailService.sendMail(
            user.email,
    'Reset your password',
    `Hello ${user.name},

You requested a password reset.

Click the link below to reset your password:

${resetUrl}

This link will expire in 15 minutes.

If you did not request this, please ignore this email.`,
  );

  return {
    message:
      'If an account exists with this email, a reset link has been sent',
  };
    }



    async resetPassword(
        token:string,
        resetPasswordDto:ResetPasswordDto
    ){
        const user = await this.prisma.user.findFirst({
            where:{
                resetPasswordToken:token,
                resetPasswordExpires:{
                    gt:new Date()
                }
            }
        })
        if(!user){
            throw new UnauthorizedException(
                "invalid email or exipred reset token"
            )
        }
        const hashedPassword=await bcrypt.hash(
            resetPasswordDto.password,
            10
        )

        await this.prisma.user.update({
            where:{
                id:user.id,
            },
            data:{
                password:hashedPassword,
                //Remove reset token
                resetPasswordToken:null,
                resetPasswordExpires:null,

                //logout form all sessions

                refreshToken:null,
            },
            
        })
        return{
            message:'Password reset Successfully'
        }

    }

    async sendOtp(sendOtpDto:SendOtpDto){
        const user = await this.prisma.user.findUnique({
            where:{
                email:sendOtpDto.email
            },
        })
        if(!user){
            throw new UnauthorizedException('User not found')
        }

        //Genrate a 6-digit OTP
        const otp=crypto.randomInt(100000,1000000).toString()
        //Hash Otp before storing it
        const otpHash=await bcrypt.hash(otp,10)
        //OTP expires in 10 minutes
        const otpExpiresAt=new Date(
            Date.now()+10*60*1000
        )

        await this.prisma.user.update({
            where:{
                id:user.id,
            },
            data:{
                otpHash,
                otpExpires: otpExpiresAt,
            }
        })
        await this.mailService.sendMail(
            user.email,
    'Verify your email',
    `Hello ${user.name},

You requested to verify your email.

Please use the OTP below to verify your email:

${otp}

This OTP will expire in 10 minutes.

If you did not request this, please ignore this email.`,
  );

  return {
    message: 'OTP sent to your email',
  };
    }


    async verifyOtp(verifyOtpDto:verifyOtpDto){
        const user = await this.prisma.user.findUnique({
            where:{
                email:verifyOtpDto.email
            }
        })
        if(!user||!user.otpHash||!user.otpExpires){
            throw new UnauthorizedException(
                'Invalid or expired OTP'
            )
        }

        const isOtpValid=await bcrypt.compare(
            verifyOtpDto.otp,
            user.otpHash,
        )
        if(!isOtpValid){
            throw new UnauthorizedException(
                "Invalid or expired OTP"
            )
        }
        if(user.otpExpires<new Date()){
            throw new UnauthorizedException(
                "Invalid or expired OTP"
            )
        }

        await this.prisma.user.update({
            where:{
                id:user.id,
            },
            data:{
                isEmailVerified:true,
                //delete OTP after successful use
                otpHash:null,
                otpExpires:null,
            }
        })
        return{
            message:'Otp verified  successfully'
        }
    }


}
