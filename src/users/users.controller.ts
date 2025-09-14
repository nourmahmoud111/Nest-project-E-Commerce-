import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UsersService } from "./users.service";
import { RegisterDto } from "./dto/register.Dto";
import { loginDto } from "./dto/login.Dto";
import { AuthGuard } from "./guards/auth.guard";
import { CurrentUser } from "./decorators/current-user.decorator";
import type { JWTPayloadType } from "src/utils/types";
import { Roles } from "./decorators/user-role.decorator";
import { UserType } from "src/utils/enums";
import { AuthRolesGuard } from "./guards/auth-roles.guard";
import { UpdateUserDto } from "./dto/update-user.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Express, Response } from "express";


@Controller("api/users")
export class UsersController{

constructor(private readonly userService:UsersService){}



@Post("auth/register")
public register (@Body() body:RegisterDto){
    return this.userService.register(body)
}

@Post("auth/login") //201
@HttpCode(HttpStatus.OK) //200
public login (@Body() body:loginDto){
    return this.userService.login(body)
}


@Get("current-user")
@UseGuards(AuthGuard)
public getCurrentUser (@CurrentUser() payload: JWTPayloadType){
    return this.userService.getCurrentUser(payload.id)
}




@Get()
@Roles(UserType.ADMIN)
@UseGuards(AuthRolesGuard)
public getAllUsers(){
            return this.userService.getAll()
}

@Put()
@Roles(UserType.ADMIN,UserType.NORMAL_USER)
@UseGuards(AuthRolesGuard)
public updateUser(@CurrentUser() payload:JWTPayloadType,@Body() body:UpdateUserDto){
    return this.userService.update(payload.id, body)
}


@Delete()
@Roles(UserType.ADMIN,UserType.NORMAL_USER)
@UseGuards(AuthRolesGuard)
public deleteUser(@Param("id",ParseIntPipe) id:number, @CurrentUser() payload:JWTPayloadType){
    return this.userService.delete(id,payload)
}




@Post('upload-image')
@UseGuards(AuthGuard)
@UseInterceptors(FileInterceptor('user-image'))
public uploadProfileImage(@UploadedFile() file:Express.Multer.File, @CurrentUser() payload:JWTPayloadType){
    if (!file) throw new BadRequestException('no image provided')
        return this.userService.setProfileImage(payload.id, file.filename)
}



@Delete('images/remove-profile-image')
@UseGuards(AuthGuard)
public removeProfileImage(@CurrentUser() payload:JWTPayloadType){
    return this.userService.removeProfileImage(payload.id)
}



@Get('images/:image')
@UseGuards(AuthGuard)
public showProfileImage(@Param('image') image:string,@Res() res:Response){
    return res.sendFile(image,{root:'images/users'})
}



@Get('verify-email/:id/:verificationToken')
public verifyEmail(@Param('id',ParseIntPipe) id:number,@Param('verificationToken') verificationToken:string){
    return this.userService.verifyEmail(id,verificationToken)
}








}