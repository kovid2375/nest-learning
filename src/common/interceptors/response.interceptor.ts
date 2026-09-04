import { Injectable, NestInterceptor,ExecutionContext,CallHandler } from "@nestjs/common";
import { map, Observable } from "rxjs";








@Injectable()
export class ResponseInterceptor implements NestInterceptor{
    intercept
        (
            context:ExecutionContext,
            next:CallHandler
        ): Observable<any>{
            return next.handle().pipe(
                map((response)=>{
                    const {
                        message,
                        ...data
                    }=response
                    return{
                        success:true,
                        message:message || 'Request successful',
                        data
                    }
            })
        )
    }
}
    
