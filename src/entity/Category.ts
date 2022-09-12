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
import { ProductCategory } from './ProductCategory';
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

  @ManyToMany(() => Category, (subCategory) => subCategory.parentCategories, {
    eager: true,
  })
  @JoinTable()
  subCategories: Category[];

  @ManyToMany(() => Category, (parentCategory) => parentCategory.subCategories)
  parentCategories: Category[];

  @ApiProperty()
  @OneToMany(() => ProductCategory, (pc) => pc.product, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  product?: ProductCategory[];
}
