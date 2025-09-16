import { createParamDecorator } from "@nestjs/common";
import { ExecutionContext } from "@nestjs/common";
import { CURRENT_USER_KEY } from "src/utils/constants";
import { JWTPayloadType } from "src/utils/types";


// Custom decorator to extract current user payload from request
export const CurrentUser = createParamDecorator(
    (data, context:ExecutionContext) =>{ 
        const request =context.switchToHttp().getRequest()   // Switch to HTTP context 
        const payload :JWTPayloadType=request[CURRENT_USER_KEY] //Extract user payload from request
        return payload  //Return the payload
    }
)