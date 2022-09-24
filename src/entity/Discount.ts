import { Entity, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { Base } from './Base';
import { Client } from './Client';
import { Category } from './Category';

@Entity()
export class Discount extends Base {
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
  @ManyToOne(() => Category, {
    onDelete: 'CASCADE',
  })
  productCategory: Category;
}
