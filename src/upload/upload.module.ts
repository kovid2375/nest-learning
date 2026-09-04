import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { PrismaModule } from 'prisma/prisma.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports:[PrismaModule,CloudinaryModule],
  controllers: [UploadController],
  providers: [UploadService]
})
export class UploadModule {}
