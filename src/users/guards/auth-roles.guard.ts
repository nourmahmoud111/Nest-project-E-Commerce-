import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { Reflector } from "@nestjs/core"
import { JwtService } from "@nestjs/jwt"
import { Request } from "express"
import { CURRENT_USER_KEY } from "src/utils/constants"
import { UserType } from "src/utils/enums"
import { JWTPayloadType } from "src/utils/types"
import { UsersService } from "../users.service"

// get role metadate- get request -extract token -validate token and extract payload from token -
// get user by payload.id from db- check the role matches with the required roles


@Injectable()
export class AuthRolesGuard implements CanActivate{  // Interface that all Guards must implement
    constructor( private readonly jwtService:JwtService,
                private readonly configservice:ConfigService, // to read .env
                private readonly reflector :Reflector, //to get metadata role
                private readonly usersService :UsersService
                ){}

// 1 if and try =return true
// 2 if and catch= return false
// 3 token undefined and else = return false

            
async canActivate(context: ExecutionContext) {
const roles :UserType[] =this.reflector.getAllAndOverride('roles',[ context.getHandler(),context.getClass(),]) // to get roles from metadata
if(!roles||roles.length ===0) return false // if no roles return false

  const request: Request = context.switchToHttp().getRequest(); // get request
  const [type, token] = request.headers.authorization?.split(" ") ?? []; // Extract token from headers

  if (token && type === "Bearer") { //check
    try {
      const payload: JWTPayloadType = await this.jwtService.verifyAsync(token, { //Validates the token using your JWT secret ,Extracts the payload { id: 1, email: "test@test.com", usertype: "ADMIN" })
        secret: this.configservice.get<string>("JWT_SECRET"),
      });
      const user = await this.usersService.getCurrentUser(payload.id) // get user from db
      if (!user) throw new UnauthorizedException("access denied ,user not found");

     if (roles.includes(user.usertype)) {  //check role
      request[CURRENT_USER_KEY] = payload; //id here
      return true; //allow request
    } 
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