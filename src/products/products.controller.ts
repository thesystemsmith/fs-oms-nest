import { Body, ClassSerializerInterceptor, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './products.dto';

@Controller('products')
@UseInterceptors(ClassSerializerInterceptor) // serialize responses automatically //interceptors are nest native tools
export class ProductsController {
    //dependancy injection in nest
    constructor(private readonly productsService: ProductsService) {}

    //create - post/products, new product in the inventory
    @Post()
    @HttpCode(HttpStatus.CREATED) //201 explicity defined
    async create(@Body() createProductDto: CreateProductDto) {
        return await this.productsService.create(createProductDto)
    }

    // for scale, we can add pagination, filtering, searching sorting logic
    // fetch all - get/products
    @Get()
    async findAll() {
        return await this.productsService.findAll()
    }

    // fetch by id - get/products/:id
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.productsService.findOne(id);
    }

    //update - patch/products/:id
    @Patch()
    async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return await this.productsService.update(id, updateProductDto)
    }

    //delete - delete/products/:id
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT) // 204 - successful but no content to return
    async remove(@Param('id') id: string) {
        await this.productsService.remove(id);
        //no return statement - 204 No Content means empty response
    }

}
