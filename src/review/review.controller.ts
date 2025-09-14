import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ReviewsService } from "./review.service";
import { Roles } from "src/users/decorators/user-role.decorator";
import { AuthRolesGuard } from "src/users/guards/auth-roles.guard";
import { UserType } from "src/utils/enums";
import type { JWTPayloadType } from "src/utils/types";
import { CreateReviewDto } from "./dto/create-review.dto";
import { CurrentUser } from "src/users/decorators/current-user.decorator";
import { UpdateReviewDto } from "./dto/update-review.dto copy";

@Controller("api/reviews")
export class ReviewController{

constructor(
    private readonly reviewsService:ReviewsService
){}

@Post(':productId')
@UseGuards(AuthRolesGuard)
@Roles(UserType.ADMIN,UserType.NORMAL_USER)
public createNewReview(@CurrentUser() payload:JWTPayloadType,@Body() body:CreateReviewDto,@Param('productId',ParseIntPipe) ProductId:number){
    return this.reviewsService.createNewReview,(payload.id,body,ProductId)
}


@Get(':productId')
@UseGuards(AuthRolesGuard)
@Roles(UserType.ADMIN)
public getAllReviews(@Query('pageNumber',ParseIntPipe) pageNumber:number, @Query('reviewPerPage',ParseIntPipe) reviewPerPage:number){
    return this.reviewsService.getAll(pageNumber,reviewPerPage)
}

@Put(':id')
@UseGuards(AuthRolesGuard)
@Roles(UserType.ADMIN,UserType.NORMAL_USER)
public updateReview(@CurrentUser() payload:JWTPayloadType,@Body() body:UpdateReviewDto,@Param('id',ParseIntPipe) id:number){
    return this.reviewsService.update(id,payload.id,body)
}


@Delete(':id')
@UseGuards(AuthRolesGuard)
@Roles(UserType.ADMIN,UserType.NORMAL_USER)
public deleteReview(@CurrentUser() payload:JWTPayloadType, @Param('id',ParseIntPipe) id:number){
    return this.reviewsService.delete(id,payload)
}





}