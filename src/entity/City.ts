import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Base } from './Base';
import { TranslatableString } from './TranslatableString';

@Entity()
export class City extends Base {
  @OneToOne(() => TranslatableString, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  name: TranslatableString;

  @Column({
    default: 0,
  })
  deliveryCost: number;
}
