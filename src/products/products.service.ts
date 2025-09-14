import { Injectable, NotFoundException } from '@nestjs/common';
import { Between, Like, Repository } from 'typeorm';
import { CreateProductDto } from './dto/Create-Product.Dto';
import { UpdateProductDto } from './dto/Update-Product.Dto';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';




@Injectable()
export class ProductsService {

    constructor (
        @InjectRepository(Product)
        private readonly productsRepository: Repository<Product>,
        private readonly UsersService :UsersService
    ) {}


    public  async createProduct(dto:CreateProductDto, userId:number){
        const user=await this.UsersService.getCurrentUser(userId)
        const newProduct = this.productsRepository.create({...dto, title:dto.title.toLowerCase(),user })
         return this.productsRepository.save(newProduct)
    }


    public  getAll(title?:string,minPrice?:string,maxPrice?:string){
        const filters = {
            ...(title? {title: Like(`%${title.toLowerCase()}%`)}:{}),
            ...(minPrice && maxPrice?{price:Between(parseInt(minPrice),parseInt(maxPrice))}:{})
        }
         return this.productsRepository.find({where : filters})
    }

    public  async getOneBy(id:number): Promise<Product>{
        const product = await this.productsRepository.findOne({where:{id}})
        if (!product) throw new NotFoundException("product not found")
         return product
    }


       public  async update(id:number, dto:UpdateProductDto){
        const product = await this.getOneBy(id);
        //update fields
        product.title = dto.title ?? product.title
        product.description = dto.description ?? product.description
        product.price = dto.price ?? product.price
        //save to db
        return this.productsRepository.save(product)
    }

         public async delete(id:number){
        const product = await this.getOneBy(id);
        await this.productsRepository.remove(product);
        return {message:"product deleted"};
    }



    

}
