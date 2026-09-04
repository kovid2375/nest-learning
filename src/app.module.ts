import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './Users/users.module';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),
    PrismaModule,UsersModule, AuthModule, MailModule
  ],
  controllers: [AppController],
providers: [AppService],
})
export class AppModule {}
