import { Module } from "@nestjs/common";
import {  ReviewsService } from './review.service';
import { ReviewController } from "./review.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Review } from "./review.entity";
import { ProductsModule } from "src/products/products.module";
import { UsersModule } from "src/users/users.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
  providers: [ReviewsService],
  controllers:[ReviewController],
  imports: [ TypeOrmModule.forFeature([Review]),ProductsModule,UsersModule,JwtModule ],
})
export class ReviewModule{

}