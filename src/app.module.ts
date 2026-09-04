import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './Users/users.module';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';
import { UploadModule } from './upload/upload.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),
    ThrottlerModule.forRoot([
      {
        ttl:60000,
        limit:10
      }
    ]),
    CacheModule.register({
      isGlobal:true,
      ttl:60*1000
    }),
    PrismaModule,UsersModule, AuthModule, MailModule, UploadModule, CloudinaryModule
  ],
  controllers: [AppController],
providers: [AppService,{provide:APP_GUARD,useClass:ThrottlerGuard}],
})
export class AppModule {}
