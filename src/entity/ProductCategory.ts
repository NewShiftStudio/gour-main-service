import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { AppEntity } from './AppEntity';
import { Category } from './Category';
import { Discount } from './Discount';
import { Product } from './Product';

@Entity()
export class ProductCategory extends AppEntity {
  @ManyToOne(() => Product, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @ManyToOne(() => Category, {
    eager: true,
    onDelete: 'CASCADE',
  })
  category: Category;

  @OneToMany(() => Discount, (discount) => discount.productCategory, {
    onDelete: 'CASCADE',
  })
  discounts: Discount[];
}
