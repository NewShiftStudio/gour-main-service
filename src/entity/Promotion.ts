import {
  Entity,
  Column,
  ManyToMany,
  OneToOne,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { AppEntity } from './AppEntity';
import { Product } from './Product';
import { Image } from './Image';
import { TranslatableString } from './TranslatableString';
import { TranslatableText } from './TranslatableText';
import { PageMeta } from './PageMeta';

@Entity()
export class Promotion extends AppEntity {
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

  @OneToOne(() => Image, {
    eager: true,
  })
  @JoinColumn()
  cardImage: Image;

  @OneToOne(() => Image, {
    eager: true,
  })
  @JoinColumn()
  pageImage: Image;

  @Column({
    type: 'float',
  })
  discount: number;

  @Column()
  start: Date;

  @Column()
  end: Date;

  @ManyToMany(() => Product, (p) => p.promotions, {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  products: Product[];

  @OneToOne(() => PageMeta, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  pageMeta: PageMeta;
}

export type IPromotion = Promotion;
