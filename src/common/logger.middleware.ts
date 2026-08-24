import { Injectable,NestMiddleware } from "@nestjs/common";
import { Request,Response,NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware{
    use(req: Request, res: Response, next: NextFunction) {
        const startTime=Date.now()
        console.log(`Incoming Request: ${req.method} ${req.originalUrl}`)
        res.on('finish',()=>{
            const duration=Date.now()-startTime
            console.log(`Response: ${res.statusCode} ${req.method} ${req.originalUrl} - ${duration}ms`)
        })
        next()
    }
}