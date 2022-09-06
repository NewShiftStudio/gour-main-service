import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Base } from './Base';
import { Product } from './Product';
import { TranslatableString } from './TranslatableString';
import { Warehouse } from './Warehouse';

@Entity()
export class ProductModification extends Base {
  @OneToOne(() => TranslatableString)
  @JoinColumn()
  title: TranslatableString;

  @Column({
    type: 'float',
  })
  weight: number;

  @Column()
  quantityInStock: number;

  @Column({
    nullable: true,
  })
  moyskladCode: number;

  @ManyToOne(() => Product)
  product: Product;

  @ManyToOne(() => Warehouse)
  warehouse: Warehouse;
}
