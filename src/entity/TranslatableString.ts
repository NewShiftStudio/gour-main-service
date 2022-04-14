import { Entity, Column } from 'typeorm';
import { AppEntity } from './AppEntity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class TranslatableString extends AppEntity {
  @ApiProperty()
  @Column()
  en: string;

  @ApiProperty()
  @Column()
  ru: string;
}
