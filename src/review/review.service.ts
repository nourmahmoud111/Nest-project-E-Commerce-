import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { ProductsService } from 'src/products/products.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto copy';
import { JWTPayloadType } from 'src/utils/types';
import { UserType } from 'src/utils/enums';

@Injectable()
export class ReviewsService {

    constructor(
         @InjectRepository(Review)
                private readonly reviewsRepository: Repository<Review>,
                private readonly usersService :UsersService,
                private readonly productsService:ProductsService
    ){}





public async createNewReview( dto:CreateReviewDto, userId:number,productId:number){
const product =await this.productsService.getOneBy(productId)
const user =await this.usersService.getCurrentUser(userId)
const review = this.reviewsRepository.create({...dto, user, product})
const result =await this.reviewsRepository.save(review)
return {
id:result.id,
comment:result.comment,
rating:result.rating,
createdAt:result.createdAt,
userId:user.id,
productId:product.id
}
}



public async getAll (pageNumber:number,reviewPerPage:number){
    return this.reviewsRepository.find({ skip: (pageNumber - 1) * reviewPerPage,take: reviewPerPage, order:{createdAt:'DESC'}})//pagination with skip and take
}


       public  async update(reviewId:number,userId:number,dto:UpdateReviewDto){
        const review = await this.getReviewBy(reviewId)
        //check
        if(review.user.id !== userId)
            throw new ForbiddenException("access denied, you are not allowed")
        //update fields
        review.rating = dto.rating ?? review.rating
        review.comment = dto.comment ?? review.comment
        //save to db
        return this.reviewsRepository.save(review)
    }



       public  async delete(reviewId:number,payload:JWTPayloadType){
        const review = await this.getReviewBy(reviewId)
        if(review.user.id === payload.id ||payload.usertype ===UserType.ADMIN){
            await this.reviewsRepository.remove(review)
            return {message:"review deleted successfully"}
        }
            throw new ForbiddenException(" you are not allowed")
    }



private async getReviewBy(id:number){
    const review = await this.reviewsRepository.findOne({where:{id}})
    if (!review) throw new NotFoundException("review not found")
        return review
    }

    


}
