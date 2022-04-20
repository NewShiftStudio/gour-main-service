import { Entity, Column, Index } from 'typeorm';
import { AppEntity } from './AppEntity';

@Entity()
export class ReferralCode extends AppEntity {
  @Index({
    unique: true,
  })
  @Column()
  code: string;

  @Column()
  discount: number;
}
