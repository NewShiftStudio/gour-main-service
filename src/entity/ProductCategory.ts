import { IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryColumn } from 'typeorm';

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
}
