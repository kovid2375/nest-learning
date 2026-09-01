import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';


@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService:AuthService,
    ){}

    @Post('register')
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
}
