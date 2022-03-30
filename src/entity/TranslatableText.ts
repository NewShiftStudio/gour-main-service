import { Entity, Column } from 'typeorm';
import { AppEntity } from './AppEntity';

@Entity()
export class TranslatableText extends AppEntity {
  @Column({
    type: 'text',
  })
  en: string;

  @Column({
    type: 'text',
  })
  ru: string;
}
