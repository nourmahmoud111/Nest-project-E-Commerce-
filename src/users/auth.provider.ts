import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AccessToken, JWTPayloadType } from "src/utils/types";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dto/register.Dto";
import { loginDto } from "./dto/login.Dto";
import * as bcrypt from 'bcrypt';
import { MailService } from "src/mail/mail.service";
import { ConfigService } from "@nestjs/config";
import { randomBytes } from "crypto";

@Injectable()
export class AuthProvider {
    
     constructor (
            @InjectRepository(User)
            private readonly usersRepository: Repository<User>, //to access db
            private readonly jwtService:JwtService, //to generate jwt
            private readonly mailService:MailService, //send email
            private readonly config:ConfigService //.env
        ) {}


            public  async register(RegisterDto:RegisterDto) {
           const{email,username,password} = RegisterDto
    
           const userFromDb= await this.usersRepository.findOne({where:{email}})
           if (userFromDb) throw new BadRequestException("user alresdy exist")
    
            
            const hashedPassword = await this.hashPassword(password)
    
            let newUser= this.usersRepository.create({
                email,
                username,
                password:hashedPassword,
                verificationToken:randomBytes(32).toString('hex') //verificationToken is generated using Node’s crypto

            })
    
            newUser =await this.usersRepository.save(newUser)
            const link= this.generateLink(newUser.id, newUser.verificationToken!) //generate link for email verification
            await this.mailService.sendVerifyTemplate(email,link)
            //return jwt in the email sending
            return { message:'verification token has been sent to email, please verify your email address' }
        }
    
    
    
    
    
        public async login (loginDto:loginDto){
            const {email ,password}= loginDto
           const user = await this.usersRepository.findOne({where:{email}})
           if(!user) throw new BadRequestException("invalid email or password")
    
           const isPassword = await bcrypt.compareSync(password, user.password)
            if(!isPassword) throw new BadRequestException("invaild email or password")
            if(!user.isAccountVerified) {
                let verificationToken=user.verificationToken
                if(!verificationToken){
                    user.verificationToken=randomBytes(32).toString('hex')//generate new token if not exist
                    const result= await this.usersRepository.save(user)
                    verificationToken=result.verificationToken
            }
            const link= this.generateLink(user.id, verificationToken!) //generate link for email verification
            await this.mailService.sendVerifyTemplate(email,link)
            throw new BadRequestException('verification token has been sent to email, please verify your email address')
        }
    
            const accessToken=await this.generateJWT({id:user.id, usertype:user.usertype})
                return {accessToken}
    
    
        }
    



//hashPassword
    public async hashPassword(password:string): Promise<string>{
     const salt= await bcrypt.genSalt(10)
        return bcrypt.hash(password,salt)

}//public for use it in users.services


    //generate jwt
    private generateJWT(payload:JWTPayloadType) :Promise<string>{
        return this.jwtService.signAsync(payload)
    }

//generateLink
    private generateLink(userId:number, verificationToken:string) {
        return `${this.config.get<string>("DOMAIN")}/api/users/verify-email/${userId}/${verificationToken}`
    }


}