import { IsNotEmpty, IsNumber, IsOptional, IsUUID, Min } from "class-validator";

// create inventory payload
export class CreateInventoryDto {
    @IsUUID()
    @IsNotEmpty()
    productId!: string;

    @IsNumber()
    @Min(0)
    onHand?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    reserved?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    reorderLevel?: number;
}

// update inventory payload
export class UpdateInventoryDto {
    @IsOptional()
    @IsNumber()
    @Min(0)
    onHand?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    reserved?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    reservedLevel?: number;
}

// response structure
export class InventoryResponseDto {
    id?: string;
    productId?: string;
    onHand?: number;
    reserved?: number;
    reorderLevel?: number;
    available?: number; // Calculated field
    createdAt?: Date;
    updatedAt?: Date;
}