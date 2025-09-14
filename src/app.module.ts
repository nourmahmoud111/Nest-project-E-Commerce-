import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReviewModule } from './review/review.module';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { Product } from './products/product.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Review } from './review/review.entity';
import { User } from './users/user.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UploadsModule } from './uploads/uploads.module';
import { MailModule } from './mail/mail.module';


@Module({
  imports: [UsersModule,ReviewModule, ProductsModule,UploadsModule,MailModule, TypeOrmModule.forRootAsync({
   inject: [ConfigService],
   useFactory: (config: ConfigService) => { 
    return {
     type: "postgres",
     database: config.get<string>("DB_DATABASE"),
     username: config.get<string>("DB_USERNAME"),
     password: config.get<string>("DB_PASSWORD"),
     port: config.get<number>("DB_PORT"),
     host: "localhost",
     synchronize: process.env.NODE_ENV !== "production", //only in development
     entities: [Product,Review,User],
   };
  },
  }), 
  ConfigModule.forRoot({ isGlobal:true,
     envFilePath: `.env.${process.env.NODE_ENV}`
    }), UploadsModule, MailModule
],

  controllers: [AppController],
  providers: [AppService ,{provide:APP_INTERCEPTOR,useClass:ClassSerializerInterceptor }],//global interseptor //exclude property with class-validator in the entity (Transforming the Response )
})
export class AppModule {}
