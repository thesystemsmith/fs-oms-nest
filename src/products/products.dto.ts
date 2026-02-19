import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

// checks before creating product record
export class CreateProductDto {
    // identifier of a product
    @IsString()
    @IsNotEmpty()
    @MaxLength(64)
    sku!: string; //unique in entity

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name!: string;

    @IsNotEmpty()
    price!: string;

    @IsOptional()
    @IsString()
    @MaxLength(3)
    currency?: string; // makes this scalable

    @IsOptional()
    @IsBoolean()
    isActive?: boolean; //default active 
}

// checks before updating product record
export class UpdateProductDto {
    @IsOptional()
    @IsString()
    @MaxLength(255)
    name?: string;

    @IsOptional()
    price?: string;

    @IsOptional()
    @IsString()
    @MaxLength(3)
    currency?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

// reponse for the above 2 operations
export class ProductResponseDto {
  id!: string;
  sku!: string;
  name!: string;
  price!: string;
  currency?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}