import { BadRequestException, Module } from "@nestjs/common";
import { UsersService } from './users.service';
import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthProvider } from "./auth.provider";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { MailModule } from "src/mail/mail.module";

@Module({
  providers: [UsersService,AuthProvider],
  controllers:[UsersController],
  exports:[UsersService],
  imports: [MailModule,
    TypeOrmModule.forFeature([User]),
  JwtModule.registerAsync({
    imports: [ConfigModule],
    inject:[ConfigService],
    useFactory:(config:ConfigService) =>{
   return {  
      global: true,
      secret: config.get<string>("JWT_SECRET"),
      signOptions: { expiresIn: config.get<string>("JWT_SECRET_IN") }}
        }
     }),MulterModule.register({
         storage:diskStorage({
             destination:'./images/users',
             filename:(req,file,cb)=>{
                 const prefix =( `${Date.now()}-${Math.round(Math.random() * 1000000)}`);
                 const filename =`${prefix}-${file.originalname}`;
                 cb(null, filename);
             }
         }),
         fileFilter(req,file,cb){
             if(!file.mimetype.startsWith('image')){
                 cb(null,true)
             }else{
                 cb(new BadRequestException('unsupported file format'),false)
             }
     },limits:{fileSize:1024*1024*2} //megabytes   
     })
    ],
})
export class UsersModule{

}