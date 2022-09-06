import { Entity, Column, ManyToOne } from 'typeorm';
import { Base } from './Base';
import { Product } from './Product';
import { Client } from './Client';

@Entity()
export class ProductGrade extends Base {
  @ManyToOne(() => Client, {
    onDelete: 'CASCADE',
  })
  client: Client;

  @Column()
  value: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  comment: string;

  @ManyToOne(() => Product, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @Column()
  productId: number;

  @Column({
    nullable: true,
  })
  isApproved: boolean;
}
