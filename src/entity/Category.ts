import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { AppEntity } from './AppEntity';
import { TranslatableString } from './TranslatableString';
import { TranslatableText } from './TranslatableText';

@Entity()
export class Category extends AppEntity {
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
  icon: string;

  @Column()
  key: string;
}
