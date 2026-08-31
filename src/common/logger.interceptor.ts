import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";



@Injectable()
export class LoggerInterceptor implements NestInterceptor{
    intercept(context:ExecutionContext,
        next:CallHandler,
    ): Observable<any>{
        const request= context.switchToHttp().getRequest()
        const startTime=Date.now()
        console.log("Before Controller")
        return next.handle().pipe(
            tap(()=>{
                const duration = Date.now()-startTime
                console.log(`Request ${request.method}${request.url} took ${duration}ms`)
                console.log("After Controller")
            })
        )
    }
}