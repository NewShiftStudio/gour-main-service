import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Base } from './Base';
import { TranslatableString } from './TranslatableString';
import { TranslatableText } from './TranslatableText';

@Entity()
export class Category extends Base {
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

  @Column()
  key: string;
}
