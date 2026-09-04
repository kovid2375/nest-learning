import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter:nodemailer.Transporter
    constructor(
        private readonly configService:ConfigService,
    ){
        this.transporter=nodemailer.createTransport({
            host:this.configService.get<string>('MAIL_HOST'),
            port:Number(
                this.configService.get<string>('MAIL_PORT'),
            ),
            secure:false,

            auth:{
                user:this.configService.get<string>('MAIL_USER'),
                pass:this.configService.get<string>('MAIL_PASS'),
            },
        });
    }
    async sendMail(
        to:string,
        subject:string,
        text:string
    ){
       try{
        const info=await this.transporter.sendMail({
            from:`"NESTJS APP" <${
                this.configService.get<string>('MAIL_USER')
            }>`,
            to,
            subject,
            text
        })
        return{
            message:'EMAIL sent Successfully',
            messageId:info.messageId
        }

       }catch(error){
        console.log(error)

        throw error
       } 
    }
    

}
