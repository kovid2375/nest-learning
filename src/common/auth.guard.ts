import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";



// @Injectable()
// export class AuthGuard implements CanActivate{
//     canActivate(context: ExecutionContext): boolean {
//         const request=context.switchToHttp().getRequest()
//         const apiKey=request.headers['x-api-key']


//         if(apiKey!=='my-secret-key'){
//             throw new UnauthorizedException('Invalid API Key')
//         }
//         return true
//     }
// }