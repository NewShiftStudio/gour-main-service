import { Entity, Column, ManyToOne } from 'typeorm';
import { Base } from './Base';
import { Product } from './Product';
import { Order } from './Order';

@Entity()
export class OrderProduct extends Base {
  @ManyToOne(() => Order)
  order: Order;

  @ManyToOne(() => Product, {
    eager: true,
  })
  product: Product;

  @Column()
  weight: number;

  @Column()
  amount: number;
}
