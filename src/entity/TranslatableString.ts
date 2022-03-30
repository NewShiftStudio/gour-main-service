import { Entity, Column } from 'typeorm';
import { AppEntity } from './AppEntity';

@Entity()
export class TranslatableString extends AppEntity {
  @Column()
  en: string;

  @Column()
  ru: string;
}
