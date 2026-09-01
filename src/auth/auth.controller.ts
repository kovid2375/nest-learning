import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';


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
}
