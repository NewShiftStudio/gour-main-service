import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { Base } from './Base';
import { Category } from './Category';
import { Order } from './Order';

@Entity()
export class PromoCode extends Base {
  @ApiProperty()
  @Column({
    unique: true,
  })
  key: string;

  @ApiProperty()
  @Column()
  discount: number;

  @ApiProperty()
  @Column()
  end: Date;

  @ApiProperty()
  @Column({ nullable: true })
  totalCount: number;

  @ApiProperty()
  @Column()
  countForOne: number;

  @ApiProperty()
  @ManyToMany(() => Category, (с) => с.promoCodes, {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  categories: Category[];

  @ApiProperty()
  @OneToMany(() => Order, (or) => or.promoCode, {
    nullable: true,
    eager: true,
    cascade: true,
  })
  orders?: Order[];
}
