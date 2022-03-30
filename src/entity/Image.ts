import { Entity, Column } from 'typeorm';
import { AppEntity } from './AppEntity';

@Entity()
export class Image extends AppEntity {
  @Column({
    type: 'varchar',
    length: 500,
  })
  small: string;

  @Column({
    type: 'varchar',
    length: 500,
  })
  full: string;
}
