import { BadRequestException, Controller, MaxFileSizeValidator, ParseFilePipe, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PrismaService } from 'prisma/prisma.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
    constructor(private readonly prisma:PrismaService,
                private readonly cloudinaryService:CloudinaryService
    ){}
    @Post('profile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @UseInterceptors(FileInterceptor('file',{
        // storage:diskStorage({
        //     destination:'./uploads',
        //     filename:(req,file,callback)=>{
        //         const uniqueSuffix=Date.now()+'-'+Math.round(Math.random()*1e9)
        //         const extension=extname(file.originalname)
        //         callback(
        //             null,
        //             `profile-${uniqueSuffix}${extension}`
        //         )
        //     }
        // }),
        fileFilter: (req, file, callback) => {
            if (!file.mimetype.match(/\/(jpeg|jpg|png|webp)$/)) {
                return callback(new BadRequestException('Only image files (jpeg, jpg, png, webp) are allowed!'), false);
            }
            callback(null, true);
        }
    }))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema:{
            type:'object',
            properties:{
                file:{
                    type:'string',
                    format:'binary',
                }
            }
        }
    })
    async uploadProfile(
        @Req()req,
        @UploadedFile(
            new ParseFilePipe({
                validators:[
                    new MaxFileSizeValidator({
                        maxSize:5*1024*1024,
                        message:'File size must be less than 5mb'
                    })
                ]
            })
        )
        file:Express.Multer.File
    ){
        const result:any=await this.cloudinaryService.uploadImage(file)
        const imageUrl=result.secure_url
        const user =await this.prisma.user.update({
            where:{
                id:req.user.userId
            },
            data:{
                profileImage:imageUrl
            },
            select:{
                id:true,
                name:true,
                email:true,
                profileImage:true
            }
        })
        return{
            message:'Profile image uploaded successfully',
            user
        }
    }

}
