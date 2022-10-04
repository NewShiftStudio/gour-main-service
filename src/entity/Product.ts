import {
  Entity,
  Column,
  ManyToMany,
  OneToOne,
  OneToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { Base } from './Base';
import { TranslatableString } from './TranslatableString';
import { TranslatableText } from './TranslatableText';
import { ProductModification } from './ProductModification';
import { Image } from './Image';
import { Price } from './Price';
import { RoleDiscount } from './RoleDiscount';
import { PageMeta } from './PageMeta';
import { ProductGrade } from './ProductGrade';
import { ApiProperty } from '@nestjs/swagger';
import { Promotion } from './Promotion';
import { Category } from './Category';

@Entity()
export class Product extends Base {
  @ApiProperty()
  @OneToOne(() => TranslatableString, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  title: TranslatableString;

  @ApiProperty()
  @OneToOne(() => TranslatableText, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  description: TranslatableText;

  @ApiProperty()
  @Column({
    nullable: true,
  })
  moyskladId: string;

  @ApiProperty()
  @ManyToMany(() => Image, (args) => args.products, {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  images: Image[];

  @ApiProperty()
  @OneToMany(() => ProductGrade, (pg) => pg.product)
  productGrades: ProductGrade[];

  @ApiProperty()
  @Column({
    type: 'float',
    default: 0,
  })
  grade: number;

  @ApiProperty()
  @ManyToMany(() => Product)
  @JoinTable()
  similarProducts: Product[];

  @ApiProperty()
  @OneToMany(() => ProductModification, (pp) => pp.product, {
    eager: true,
    cascade: true,
  })
  pieces: ProductModification[];

  @ApiProperty()
  @OneToOne(() => Price, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  price: Price;

  @ApiProperty()
  @OneToMany(() => RoleDiscount, (rd) => rd.product, {
    eager: true,
    cascade: true,
  })
  roleDiscounts: RoleDiscount[];

  @ManyToMany(() => Category, (category) => category.products, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'product_category',
    joinColumn: {
      name: 'productId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'categoryId',
      referencedColumnName: 'id',
    },
  })
  categories: Category[];

  @ManyToMany(() => Promotion, (p) => p.products, {
    onDelete: 'CASCADE',
  })
  promotions: Promotion[];

  @ApiProperty()
  @OneToOne(() => PageMeta, {
    cascade: true,
  })
  @JoinColumn()
  meta: PageMeta;

  @ApiProperty()
  @Column({
    default: false,
  })
  isWeightGood: boolean;

  @ApiProperty()
  @Column({
    default: 0,
  })
  weight: number;

  @ApiProperty()
  @Column({
    default: 0,
  })
  amount: number;

  @ApiProperty()
  @Column({
    default: 0,
  })
  discount: number;
}
