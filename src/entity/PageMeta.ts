import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { AppEntity } from './AppEntity';
import { TranslatableString } from './TranslatableString';

@Entity()
export class PageMeta extends AppEntity {
  @OneToOne(() => TranslatableString, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  metaTitle: TranslatableString;

  @OneToOne(() => TranslatableString, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  metaDescription: TranslatableString;

  @OneToOne(() => TranslatableString, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  metaKeywords: TranslatableString;

  @Column()
  isIndexed: boolean;
}
