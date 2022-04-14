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

@Entity()
export class Product extends AppEntity {
  @OneToOne(() => TranslatableString, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  title: TranslatableString;

  @OneToOne(() => TranslatableText, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  description: TranslatableText;

  @Column({
    nullable: true,
  })
  moyskladId: string;

  @ManyToMany(() => Image, {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  images: Image[];

  @ManyToOne(() => Category, {
    eager: true,
  })
  category: Category;

  @OneToMany(() => ProductGrade, (pg) => pg.product)
  productGrades: ProductGrade[];

  @Column({
    type: 'float',
    default: 0,
  })
  grade: number;

  @ManyToMany(() => Product)
  @JoinTable()
  similarProducts: Product[];

  @OneToMany(() => ProductModification, (pp) => pp.product, {
    eager: true,
    cascade: true,
  })
  pieces: ProductModification[];

  @OneToOne(() => Price, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  price: Price;

  @OneToMany(() => RoleDiscount, (rd) => rd.product, {
    eager: true,
    cascade: true,
  })
  roleDiscounts: RoleDiscount[];

  @Column('json')
  characteristics: Record<string, string | number>;

  @OneToOne(() => PageMeta, {
    cascade: true,
  })
  @JoinColumn()
  meta: PageMeta;

  @Column({
    default: false,
  })
  isWeightGood: boolean;

  @Column({
    default: 0,
  })
  weight: number;

  @Column({
    default: 0,
  })
  amount: number;
}
