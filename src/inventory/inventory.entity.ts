import { Product } from "src/products/products.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('inventory')
export class Inventory {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // provide a foreign key constraint so that i can use product id here
    @OneToOne(() => Product, {onDelete: 'CASCADE'})// inventory record will be deleted if product record is deleted
    @JoinColumn({ name: 'product_id'})
    product!: Product;

    @Column({ name:'product_id', type:'uuid', unique:true})
    productId!: string;

    @Column({ type: 'int', default: 0 })
    onHand?: number;

    @Column({ type: 'int', default: 0 })
    reserved?: number;

    @Column({ type: 'int', default: 0 })
    reorderLevel?: number;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt?: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt?: Date;

}