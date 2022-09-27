import { Entity, Column, ManyToMany } from 'typeorm';
import { Base } from './Base';
import { Product } from './Product';

@Entity()
export class Image extends Base {
  @Column({
    type: 'varchar',
    length: 500,
  })
  small: string;

  @Column({
    type: 'varchar',
    length: 500,
  })
  full: string;

  @ManyToMany(() => Product, (args) => args.images)
  products: Product[];
}
