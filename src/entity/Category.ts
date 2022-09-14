import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { AppEntity } from './AppEntity';
import { Discount } from './Discount';
import { Product } from './Product';
import { TranslatableString } from './TranslatableString';

@Entity()
export class Category extends AppEntity {
  @ApiProperty()
  @OneToOne(() => TranslatableString, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  title: TranslatableString;

  @ApiProperty()
  @ManyToMany(() => Category, (subCategory) => subCategory.parentCategories)
  @JoinTable()
  subCategories?: Category[];

  @ApiProperty()
  @ManyToMany(
    () => Category,
    (parentCategory) => parentCategory.subCategories,
    {
      cascade: true,
    },
  )
  parentCategories?: Category[];

  @ApiProperty()
  @ManyToMany(() => Product, (product) => product.categories, { cascade: true })
  products: Product[];

  @OneToMany(() => Discount, (discount) => discount.productCategory, {
    onDelete: 'CASCADE',
  })
  discounts?: Discount[];
}
