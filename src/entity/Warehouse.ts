import { Entity, Column, ManyToOne } from 'typeorm';
import { Base } from './Base';
import { City } from './City';

@Entity()
export class Warehouse extends Base {
  @Column()
  title: string;

  @ManyToOne(() => City)
  city: City;
}
