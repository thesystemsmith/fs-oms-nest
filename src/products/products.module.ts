import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product])], //this helps in repository injection in service files, something which spingboot does with out this 
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
