import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { Base } from './Base';
import { TranslatableString } from './TranslatableString';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class PageMeta extends Base {
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
