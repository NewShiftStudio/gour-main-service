import {
  Entity,
  Column,
  ManyToMany,
  OneToOne,
  ManyToOne,
  OneToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { AppEntity } from './AppEntity';
import { TranslatableString } from './TranslatableString';
import { TranslatableText } from './TranslatableText';
import { Category } from './Category';
import { ProductModification } from './ProductModification';
import { Image } from './Image';
import { Price } from './Price';
import { RoleDiscount } from './RoleDiscount';
import { PageMeta } from './PageMeta';
import { ProductGrade } from './ProductGrade';
import { ApiProperty } from '@nestjs/swagger';
import { Promotion } from './Promotion';

@Entity()
export class Product extends AppEntity {
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
  @ManyToMany(() => Image, {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  images: Image[];

  @ApiProperty()
  @ManyToOne(() => Category, {
    onDelete: 'CASCADE',
    eager: true,
  })
  category: Category;

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

  @ManyToMany(() => Promotion, (p) => p.products, {
    onDelete: 'CASCADE',
  })
  promotions: Promotion[];

  @ApiProperty()
  @Column('json')
  characteristics: Record<string, string | number>;

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
