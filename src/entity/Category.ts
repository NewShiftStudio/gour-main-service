import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { Base } from './Base';
import { Discount } from './Discount';
import { Product } from './Product';
import { TranslatableString } from './TranslatableString';

@Entity()
export class Category extends Base {
  @ApiProperty()
  @OneToOne(() => TranslatableString, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  title: TranslatableString;

  @ApiProperty()
  @ManyToMany(() => Category, (subCategory) => subCategory.parentCategories, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  subCategories?: Category[];

  @ApiProperty()
  @ManyToMany(
    () => Category,
    (parentCategory) => parentCategory.subCategories,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  parentCategories?: Category[];

  @ApiProperty()
  @ManyToMany(() => Product, (product) => product.categories, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  products: Product[];

  @OneToMany(() => Discount, (discount) => discount.productCategory, {
    onDelete: 'CASCADE',
  })
  discounts?: Discount[];
}
