import { Entity, Column, ManyToOne } from 'typeorm';
import { AppEntity } from './AppEntity';
import { City } from './City';

@Entity()
export class Warehouse extends AppEntity {
  @Column()
  title: string;

  @ManyToOne(() => City)
  city: City;
}
