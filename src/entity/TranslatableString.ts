import { Entity, Column } from 'typeorm';
import { Base } from './Base';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class TranslatableString extends Base {
  @ApiProperty()
  @Column()
  en: string;

  @ApiProperty()
  @Column()
  ru: string;
}
