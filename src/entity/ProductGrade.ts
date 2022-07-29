import { Entity, Column, ManyToOne } from 'typeorm';
import { AppEntity } from './AppEntity';
import { Product } from './Product';
import { Client } from './Client';

@Entity()
export class ProductGrade extends AppEntity {
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

  @Column({
    nullable: true,
  })
  isApproved: boolean;
}
