import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/Create-Product.Dto';
import { UpdateProductDto } from './dto/Update-Product.Dto';
import { AuthRolesGuard } from 'src/users/guards/auth-roles.guard';
import { Roles } from 'src/users/decorators/user-role.decorator';
import { UserType } from 'src/utils/enums';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import type { JWTPayloadType } from 'src/utils/types';
import { title } from 'process';



@Controller("/api/products")
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}
    
    @Post()
    @UseGuards(AuthRolesGuard)
    @Roles(UserType.ADMIN)
    public createNewProduct(@Body() body:CreateProductDto,@CurrentUser() payload:JWTPayloadType) {
        return this.productsService.createProduct(body,payload.id);
    }


    @Get()
    public getAllProducts(@Query('title') title:string,@Query('minPrice')minPrice:string,@Query('maxPrice')maxPrice:string){
        return this.productsService.getAll(title,minPrice,maxPrice);
    }

    @Get(":id")
    public getSingleProduct(@Param("id", ParseIntPipe) id: number){
        return this.productsService.getOneBy(id);
    }

    
    @Put(":id")
    @UseGuards(AuthRolesGuard)
    @Roles(UserType.ADMIN)
    public updateProduct(@Param("id", ParseIntPipe) id: number,@Body() body:UpdateProductDto){
        return this.productsService.update(id,body);
    }

    @Delete(":id")
    @UseGuards(AuthRolesGuard)
    @Roles(UserType.ADMIN)
    public deleteProduct(@Param("id", ParseIntPipe) id: number){
        return this.productsService.delete(id);
    }
    
}
