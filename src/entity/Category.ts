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

  @ApiProperty()
  @ManyToMany(() => Category, (subCategory) => subCategory.parentCategories, {
    cascade: true,
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
  @OneToMany(() => ProductCategory, (pc) => pc.product, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  product?: ProductCategory[];
}
