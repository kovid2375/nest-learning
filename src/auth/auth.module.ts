import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import 'dotenv/config';
import { ConfigService } from '@nestjs/config';
@Module({
  imports:[JwtModule.registerAsync({
    inject:[ConfigService],
    useFactory:(configService:ConfigService)=>({
      secret:configService.getOrThrow<string>('JWT_SECRET'),
      signOptions:{expiresIn:'1d'}
    })
  })],
  providers: [AuthService,JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
