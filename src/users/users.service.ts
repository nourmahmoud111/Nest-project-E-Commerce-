import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.Dto';
import { loginDto } from './dto/login.Dto';
import { AccessToken, JWTPayloadType } from 'src/utils/types';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserType } from 'src/utils/enums';
import { AuthProvider } from './auth.provider';
import * as bcrypt from 'bcrypt';
import { join } from 'path';
import { unlinkSync } from 'fs';

@Injectable()
export class UsersService {   
    constructor (
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>, //to access db
        private readonly authProvider:AuthProvider, 
    ) {}


        public  async register(RegisterDto:RegisterDto) {
             return this.authProvider.register(RegisterDto)
    }





    public async login (loginDto:loginDto){
          return this.authProvider.login(loginDto)

    }



    //return single user
    public async getCurrentUser(id :number):Promise<User>{
            const user = await this.usersRepository.findOne({where:{id}})
            if(!user) throw new NotFoundException("user not found")
                return user
    }



    public getAll():Promise<User[]>{
        return this.usersRepository.find()
    }


    public async update(id:number, updateUserDto:UpdateUserDto){
        const {password,username}= updateUserDto
       const user= await this.usersRepository.findOne({where:{id}})
       if (!user) {
     throw new NotFoundException("User not found"); 
  }

       user.username= username?? user.username  // 2. update username if provided, otherwise keep the old one
       if(password){
        const salt= await bcrypt.genSalt(10)
        user.password= await this.authProvider.hashPassword(password)
       }
       return this.usersRepository.save(user)
    }


    public async delete(userId:number,payload:JWTPayloadType){
        const user= await this.getCurrentUser(userId)

        if(user.id === payload?.id || payload.usertype === UserType.ADMIN){
            await this.usersRepository.remove(user)
            return {message:"user has been deleted"}
        }
    }



    public async setProfileImage(userId:number,newProfileImage:string){
        const user= await this.getCurrentUser(userId)
        if(user.profileImage === null){
        user.profileImage= newProfileImage
        }else{ 
        await this.removeProfileImage(userId) //delete old image from folder
        user.profileImage=newProfileImage    
        }
        return this.usersRepository.save(user)

    }



    public async removeProfileImage(userId:number){
        const user= await this.getCurrentUser(userId)
        if(user.profileImage === null) throw new BadRequestException('there is no profile image')

            const imagePath=join(process.cwd(),`./images/users/${user.profileImage}`)
            unlinkSync(imagePath) //delete image from folder
            user.profileImage==null
            return this.usersRepository.save(user)

    }



    public async verifyEmail (userId:number, verificationToken:string){
        const user = await this.getCurrentUser(userId)

        if(user.verificationToken ==null ) throw new NotFoundException("there is no verification token")
            if (user.verificationToken !== verificationToken) throw new BadRequestException('invaild link')
            user.isAccountVerified=true
            user.verificationToken=null

            await this.usersRepository.save(user)
            return{message :"your email has been verified, please log in your account"}

    }







    }




