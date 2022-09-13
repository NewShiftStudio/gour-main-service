import { IsNotEmpty } from 'class-validator';
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { AppEntity } from './AppEntity';
import { Category } from './Category';
import { Discount } from './Discount';
import { Product } from './Product';

@Entity('product_category')
export class ProductCategory {
  @Column()
  @IsNotEmpty()
  @PrimaryColumn()
  productId: number;

  @Column()
  @IsNotEmpty()
  @PrimaryColumn()
  categoryId: number;

  @OneToMany(() => Discount, (discount) => discount.productCategory, {
    onDelete: 'CASCADE',
  })
  discounts: Discount[];
}
