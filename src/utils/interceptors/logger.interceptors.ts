import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map,tap, Observable } from "rxjs";


//custom interseptor we dont use it in this project this is for test
//Transforming the Response (Interceptor removes password from response)
@Injectable()
export class LoggerInterceptor implements NestInterceptor{
intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    console.log("before route handler")


    return next.handle().pipe(map((dataFromRouteHandler)=>{
        const {password , ...otherDate}=dataFromRouteHandler //Destructures the object and removes the password field.
        return {...otherDate}
    }))
}
}