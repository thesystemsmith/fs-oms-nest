import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from './inventory.entity';
import { Repository } from 'typeorm';
import { ProductsService } from 'src/products/products.service';
import { CreateInventoryDto, UpdateInventoryDto } from './inventory.dto';

@Injectable()
export class InventoryService {
    constructor(
        @InjectRepository(Inventory)
        private readonly inventoryRepository: Repository<Inventory>,
        private readonly productsService: ProductsService,
    ){}

    //create inventory
    //product must exist for inventory
    //one product -> one inventory
    async create(createInventoryDto: CreateInventoryDto): Promise<Inventory>{
        //checks
        //early failure
        await this.productsService.findOne(createInventoryDto.productId) //no where clause if you search by id

        const existingInventory = await this.inventoryRepository.findOne({
            where: {productId: createInventoryDto.productId}
        })

        if(existingInventory){
            throw new ConflictException(`Inventory already exists for product '${createInventoryDto.productId}'`)
        }

        //create
        const inventory = this.inventoryRepository.create({
            productId: createInventoryDto.productId,
            onHand: createInventoryDto.onHand,
            reserved: createInventoryDto.reserved || 0,
            reorderLevel: createInventoryDto.reorderLevel || 0
        })

        //save
        return await this.inventoryRepository.save(inventory);
    }

    //get all inventory
    async findAll(): Promise<Inventory[]> {
        return await this.inventoryRepository.find({
            relations: ['product'], // Load product details, this is similar to sql joins but with orm its simpler
            order: {
                createdAt: 'DESC',
            },
        });
    }

    //get specific inventory - by product id 
    async findByProductId(productId: string): Promise<Inventory> {
        // validate uuid format
        if (!this.isValidUUID(productId)) {
            throw new BadRequestException('Invalid product ID format');
        }

        const inventory = await this.inventoryRepository.findOne({
            where: { productId },
            relations: ['product'], // Include product details
        });

        if (!inventory) {
            throw new NotFoundException(`Inventory not found for product '${productId}'`);
        }

        return inventory;
    }

    //get specific inventory - by inventory id 
    async findOne(id: string): Promise<Inventory> {
        //validate uuid format
        if (!this.isValidUUID(id)) {
            throw new BadRequestException('Invalid inventory ID format');
        }

        const inventory = await this.inventoryRepository.findOne({
            where: { id },
            relations: ['product'],//product details in the response
        });

        if (!inventory) {
            throw new NotFoundException(`Inventory with ID '${id}' not found`);
        }

        return inventory;
    }

    //update inventory - if required manually, we will implement kafka processor for this later
    async update(productId: string, updateInventoryDto: UpdateInventoryDto){
        //exists?
        const inventory = await this.findByProductId(productId)

        //validate business logic
        if(updateInventoryDto.onHand !== undefined && updateInventoryDto.onHand < 0) {
            throw new BadRequestException('stock on hand cannot be negative')
        }
        if (updateInventoryDto.reserved !== undefined && updateInventoryDto.reserved < 0) {
            throw new BadRequestException('reserved stock cannot be negative')
        }

        //on hand > reserved ?
        const newOnHand = updateInventoryDto.onHand ?? inventory.onHand!; //inventory must have this value

        const newReserved = updateInventoryDto.reserved ?? inventory.reserved!; //inventory must have this value

        if (newReserved > newOnHand) {
            throw new BadRequestException('Reserved stock cannot exceed stock on hand');
        }

        //update only provided fields
        Object.assign(inventory, updateInventoryDto)
        //save
        return await this.inventoryRepository.save(inventory)
    }

    //delete inventory - if needed manually done
    async remove(id: string): Promise<void> {
        const inventory = await this.findOne(id)
        await this.inventoryRepository.remove(inventory)
    }

    //get low stock items
    async findLowStock(): Promise<Inventory[]> {
        //query builder for complex queries
        return await this.inventoryRepository
            .createQueryBuilder('inventory')
            .leftJoinAndSelect('inventory.product', 'product')
            .where('inventory.onHand <= inventory.reorderLevel')
            .andWhere('inventory.reorderLevel > 0') // Only items with reorder level set
            .orderBy('inventory.onHand', 'ASC') // Lowest stock first
            .getMany();
    }

    //helper
    private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

}
