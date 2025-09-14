import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { JwtService } from "@nestjs/jwt"
import { Request } from "express"
import { CURRENT_USER_KEY } from "src/utils/constants"
import { JWTPayloadType } from "src/utils/types"

@Injectable()
export class AuthGuard implements CanActivate{
    constructor( private readonly jwtService:JwtService,
                private readonly configservice:ConfigService  
                ){}

// 1 if and try =return true
// 2 if and catch= return false
// 3 token undefined and else = return false

                
async canActivate(context: ExecutionContext) {
  const request: Request = context.switchToHttp().getRequest(); // get request
  const [type, token] = request.headers.authorization?.split(" ") ?? []; //  split by space

  if (token && type === "Bearer") { //check
    try {
      const payload: JWTPayloadType = await this.jwtService.verifyAsync(token, {
        secret: this.configservice.get<string>("JWT_SECRET"),
      });

      // attach user payload to request
      request[CURRENT_USER_KEY] = payload; //id here
      return true; //allow request
    } 
    
    catch (error) {
      throw new UnauthorizedException("access denied ,invalid token"); //  invalid token
    }

  } else {
        throw new UnauthorizedException("access denied ,no token provided"); // if not run
  }
  return true
}

}