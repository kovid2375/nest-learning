import { Body, Controller, Get, Post, Query, UseGuards,} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { verifyOtpDto } from './dto/verify-otp.dto';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService:AuthService,
    ){}

    @Post('register')
    @Throttle({
        default:{
            limit:2,
            ttl:60000
        }
    })
    @ApiOperation({
        summary:'Register a new user'
    })
    @ApiResponse({
        status:201,
        description:'user registerd successfully'
    })
    @ApiResponse({
        status:409,
        description:'Email already registered'
    })
    register(
        @Body() registerDto:RegisterDto
    ){
        return this.authService.register(registerDto)
    }

    @Post('login')
    @Throttle({
        default:{
            limit:2,
            ttl:60000
        }
    })
    @ApiOperation({
        summary:'Login and receive token'
    })
    @ApiResponse({
        status:200,
        description:'Login successful'
    })
    @ApiResponse({
        status:401,
        description:'Invalid email or password'
    })
    login(
        @Body() loginDto:LoginDto
    ){
        return this.authService.login(loginDto)
    }

    @Get('profile')
    @ApiOperation(
        {
            summary:'Get current user profile'
        }
    )
    @ApiResponse({
        status:200,
        description:'User profile fetched successfully'
    })
    @ApiResponse({
        status:401,
        description:'Invalid email or password'
    })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    getProfile(@CurrentUser() user:any){
        return this.authService.getProfile(user.userId)
    }


    @Post('refresh')
    @Public()
    @ApiOperation({
        summary:'Get new access and refresh tokens',
    })
    refreshTokens(
        @Body() refreshTokenDto:RefreshTokenDto,
    ){
        return this.authService.refreshTokens(
            refreshTokenDto.refreshToken
        )
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    logout(@CurrentUser() user:any){
        return this.authService.logout(user.userId)
    }


    @Get('verify-email')
    @Public()
    @ApiOperation({
        summary:'Verify user email'
    })
    @ApiResponse({
        status:200,
        description:'Email verified successfully'
    })
    @ApiResponse({
        status:400,
        description:'Invalid or expired verification token'
    })
    verifyEmail(
        @Query('token') token:string,
    ){
        return this.authService.verifyEmail(token)
    }



    @Post('forgot-password')
    @Public()
    @ApiOperation({
        summary:'Forgot password'
    })
    @ApiResponse({
        status:200,
        description:'Password reset link sent successfully'
    })
    @ApiResponse({
        status:400,
        description:'Invalid email'
    })
    forgotPassword(
        @Body() forgotPasswordDto:ForgotPasswordDto
    ){
        return this.authService.forgotpassword(forgotPasswordDto)
    }

    @Post('reset-password')
    @Public()
    @ApiOperation({
        summary:'Reset password'
    })
    @ApiResponse({
        status:200,
        description:'Password reset successfully'
    })
    @ApiResponse({
        status:400,
        description:'Invalid reset token'
    })
    resetPassword(
        @Query('token') token:string,
        @Body() resetPasswordDto:ResetPasswordDto
    ){
        return this.authService.resetPassword(token,resetPasswordDto)
    }



    @Post('send-otp')
    @Throttle({
        default:{
            limit:1,
            ttl:60000
        }
    })
    @Public()
    @ApiOperation({
        summary:'Send OTP'
    })
    @ApiResponse({
        status:200,
        description:'OTP sent successfully'
    })
    @ApiResponse({
        status:400,
        description:'Invalid email'
    })
    sendOtp(@Body()sendOtpDto:SendOtpDto){
        return this.authService.sendOtp(sendOtpDto)
    }



    @Post('verify-otp')
    @Public()
    @ApiOperation({
        summary:'Verify OTP'
    })
    @ApiResponse({
        status:200,
        description:'OTP verified successfully'
    })
    @ApiResponse({
        status:400,
        description:'Invalid or expired OTP'
    })
    verifyOtp(@Body()verifyOtpDto:verifyOtpDto){
        return this.authService.verifyOtp(verifyOtpDto)
    }
}
