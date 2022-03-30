import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { AppEntity } from './AppEntity';
import { TranslatableString } from './TranslatableString';

@Entity()
export class City extends AppEntity {
  @OneToOne(() => TranslatableString, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  name: TranslatableString;
}
