import { Entity, Column } from 'typeorm';
import { Base } from './Base';

@Entity()
export class TranslatableText extends Base {
  @Column({
    type: 'text',
  })
  en: string;

  @Column({
    type: 'text',
  })
  ru: string;
}
