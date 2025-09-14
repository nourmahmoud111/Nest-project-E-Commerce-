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
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { UploadsModule } from './uploads/uploads.module';
import { MailModule } from './mail/mail.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';


@Module({

  imports: [
    UsersModule,
    ReviewModule,
    ProductsModule,
    UploadsModule,
    MailModule,
    TypeOrmModule.forRootAsync({    // Database connection with TypeORM
   inject: [ConfigService],         // Inject ConfigService to read environment variables
   useFactory: (config: ConfigService) => { 
    return {
     type: "postgres",
     database: config.get<string>("DB_DATABASE"),
     username: config.get<string>("DB_USERNAME"),
     password: config.get<string>("DB_PASSWORD"),
     port: config.get<number>("DB_PORT"),
     host: "localhost",
     synchronize: process.env.NODE_ENV !== "production",  //  Auto-sync schema only in development, not in production , we should migration with typeorm with remote db not local db
     entities: [Product,Review,User],                   // entities to sync with db
   };
  },
  }), 
  ConfigModule.forRoot({ // ConfigModule (global), loads environment variables
    isGlobal:true,      // available everywhere without re-importing
    envFilePath: `.env.${process.env.NODE_ENV}` //// load correct .env file
    }),ThrottlerModule.forRoot([     // ThrottlerModule → rate limiting for requests
      { 
      ttl:10000, //10sec
      limit:3, //3 requests every 10 seconds for a client
      }
  ])       ],


  controllers: [AppController],


  providers: [AppService ,
  {provide:APP_INTERCEPTOR,useClass:ClassSerializerInterceptor },//global interseptor //exclude property with class-validator in the entity (Transforming the Response )
  {provide:APP_GUARD,useClass:ThrottlerGuard} // Apply ThrottlerGuard globally → enforces rate limiting
              ],


})
export class AppModule {}
