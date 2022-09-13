import { Entity, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { AppEntity } from './AppEntity';
import { Client } from './Client';
import { ProductCategory } from './ProductCategory';

@Entity()
export class Discount extends AppEntity {
  @ApiProperty()
  @Column({
    default: 0,
  })
  price: number;

  @ApiProperty()
  @ManyToOne(() => Client, {
    onDelete: 'CASCADE',
  })
  client: Client;

  @ApiProperty()
  @ManyToOne(() => ProductCategory, {
    onDelete: 'CASCADE',
  })
  productCategory: ProductCategory;
}
