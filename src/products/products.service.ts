import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './products.entity';
import { Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from './products.dto';

@Injectable()
export class ProductsService {
    // inject repository - our entity 
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {}

    //create a new product
    async create(createProductDto: CreateProductDto): Promise<Product> {
        //check if sku exist before creating
        const existingProduct = await this.productRepository.findOne({
            where: {
                sku: createProductDto.sku
            },
        })

        //if already exists, throw error
        if(existingProduct) {
            throw new ConflictException(`product with sku: '${createProductDto.sku}' already exists`)
        }

        //create new product instance
        const product = this.productRepository.create({
            sku: createProductDto.sku,
            name: createProductDto.name,
            price: createProductDto.price,
            currency: createProductDto.currency || 'INR', //if not provided default it
            isActive: createProductDto.isActive !== undefined ? createProductDto.isActive : true
        })

        return await this.productRepository.save(product);
    }

    //get all products - list
    async findAll(): Promise<Product[]> {
        return await this.productRepository.find({
            order: {
                createdAt: 'DESC', //most recent first
            },
        })
    }

    //get a specfic product - id
    async findOne(id: string): Promise<Product>{
        //uuid check
        if(!this.isValidUUID(id)){
            throw new BadRequestException('invalid product id format')
        }

        const product = await this.productRepository.findOne({
            where: {
                id
            }
        })

        if(!product){
            throw new NotFoundException(`product with id '${id}' not found`)
        }

        return product;
    }

    //update a product
    async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
        //does product exist?
        const product = await this.findOne(id) //this is using the member function and not repo directy, to follow DRY principle

        //object.assign only updates the provided fields without touching everything else
        Object.assign(product, updateProductDto)
        //save to db
        return await this.productRepository.save(product)
    }

    //delete a product - this is a hard delete - for production, we usually prefer soft delete (by keeping a column for example)
    async remove(id: string): Promise<void>{
        //does the product exists?
        const product = await this.findOne(id)

        await this.productRepository.remove(product)
    }

    private isValidUUID(uuid: string): boolean{
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    }
}

