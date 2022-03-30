import { Entity, Column, ManyToOne } from 'typeorm';
import { AppEntity } from './AppEntity';
import { Product } from './Product';
import { Order } from './Order';
import { ProductModification } from './ProductModification';

@Entity()
export class OrderProduct extends AppEntity {
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
