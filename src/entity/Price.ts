import { Entity, Column } from 'typeorm';
import { Base } from './Base';

@Entity()
export class Price extends Base {
  @Column({
    type: 'float',
  })
  cheeseCoin: number;
}
