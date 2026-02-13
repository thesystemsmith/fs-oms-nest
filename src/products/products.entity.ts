import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id!: string; // ! means required 

    @Index({ unique: true })
    @Column({ type: 'varchar', length: 64 })
    sku!: string;

    @Column({ type: 'varchar', length: 255 })
    name!: string;

    @Column({ type:'numeric', precision: 12, scale:2})
    price!: string;

    @Column({ type:'varchar', length: 3, default: 'INR'})
    currency?: string; // ? means optional

    @Column({ type: 'boolean', default: true})
    isActive?: boolean;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt?: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt?: Date;
    
}