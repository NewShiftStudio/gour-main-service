import { Entity, Column, Index } from 'typeorm';
import { Base } from './Base';

@Entity()
export class ReferralCode extends Base {
  @Index({
    unique: true,
  })
  @Column()
  code: string;

  @Column()
  discount: number;
}
