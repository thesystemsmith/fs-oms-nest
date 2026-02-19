import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpCode,
    HttpStatus,
    UseInterceptors,
    ClassSerializerInterceptor,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto, UpdateInventoryDto } from './inventory.dto';

@Controller('inventory')
@UseInterceptors(ClassSerializerInterceptor)
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) { }

    //CREATE - POST /inventory
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createInventoryDto: CreateInventoryDto) {
        return await this.inventoryService.create(createInventoryDto);
    }

   
    //READ ALL - GET /inventory
    @Get()
    async findAll() {
        return await this.inventoryService.findAll();
    }

    // READ BY PRODUCT ID - GET /inventory/product/:productId
    @Get('product/:productId')
    async findByProductId(@Param('productId') productId: string) {
        return await this.inventoryService.findByProductId(productId);
    }

    // READ LOW STOCK - GET /inventory/low-stock
    @Get('low-stock/list')
    async findLowStock() {
        return await this.inventoryService.findLowStock();
    }

    // READ ONE - GET /inventory/:id
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.inventoryService.findOne(id);
    }

    // UPDATE - PATCH /inventory/product/:productId
    @Patch('product/:productId')
    async update(
        @Param('productId') productId: string,
        @Body() updateInventoryDto: UpdateInventoryDto,
    ) {
        return await this.inventoryService.update(productId, updateInventoryDto);
    }

    // DELETE - DELETE /inventory/:id
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string) {
        await this.inventoryService.remove(id);
    }
}