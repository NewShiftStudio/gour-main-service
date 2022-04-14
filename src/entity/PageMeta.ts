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
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class PageMeta extends AppEntity {
  @ApiProperty()
  @OneToOne(() => TranslatableString, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  metaTitle: TranslatableString;

  @ApiProperty()
  @OneToOne(() => TranslatableString, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  metaDescription: TranslatableString;

  @ApiProperty()
  @OneToOne(() => TranslatableString, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  metaKeywords: TranslatableString;

  @ApiProperty()
  @Column()
  isIndexed: boolean;
}
