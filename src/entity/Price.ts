import { Entity, Column } from 'typeorm';
import { Base } from './Base';

@Entity()
export class Price extends Base {
  @Column({
    type: 'float',
  })
  cheeseCoin: number;

  @Column({
    type: 'float',
  })
  individual: number;

  @Column({
    type: 'float',
  })
  company: number;

  @Column({
    type: 'float',
  })
  companyByCash: number;
}
