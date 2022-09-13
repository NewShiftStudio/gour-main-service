import { ApiProperty } from '@nestjs/swagger';
import { Entity, JoinColumn, JoinTable, ManyToMany, OneToOne } from 'typeorm';

import { AppEntity } from './AppEntity';
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
}
