import { Injectable } from '@nestjs/common';
import { cloudinary } from './cloudinary.config';

@Injectable()
export class CloudinaryService {
    
    async uploadImage(file:Express.Multer.File){
        return new Promise((resolve,reject)=>{
            const uploadStream=cloudinary.uploader.upload_stream(
                {
                    folder:'nest-learing/profile-image',
                    resource_type:'image'
                },
                (error,result)=>{
                    if(error){
                        return reject(error)
                    }
                    resolve(result)
                }
            )
            uploadStream.end(file.buffer)
        })
    }
    async deleteImage(publicId:string){
        return cloudinary.uploader.destroy(publicId,{
            resource_type:'image'
        })
    }
}
