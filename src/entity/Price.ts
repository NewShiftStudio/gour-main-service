import { Entity, Column } from 'typeorm';
import { AppEntity } from './AppEntity';

@Entity()
export class Price extends AppEntity {
  @Column({
    type: 'float',
  })
  rub: number;

  @Column({
    type: 'float',
  })
  eur: number;
}
