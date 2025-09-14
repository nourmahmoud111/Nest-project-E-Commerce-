import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { User } from 'src/users/user.entity';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    public async sendLogInEmail(email:string){                        
        try {
                    const today = new Date()
                    await this.mailerService.sendMail({
                        to:email,
                        from:`<no-reply@my-nest-app.com>`,
                        subject:'login',
                        template:'login',
                        context:[email,today]
                    })
                } catch (error) {
                    console.log(error)
                    throw new RequestTimeoutException()
                }}



    public async sendVerifyTemplate(email:string ,link:string){                        
        try {
                    await this.mailerService.sendMail({
                        to:email,
                        from:`<no-reply@my-nest-app.com>`,
                        subject:'verify your accuont',
                        template:'verify-email',
                        context:[link]
                    })
                } catch (error) {
                    console.log(error)
                    throw new RequestTimeoutException()
                }}
    }

