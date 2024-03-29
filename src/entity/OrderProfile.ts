import { Entity, Column, ManyToOne } from 'typeorm';
import { Base } from './Base';
import { City } from './City';
import { Client } from './Client';

@Entity()
export class OrderProfile extends Base {
  @Column()
  title: string;

  @ManyToOne(() => City, {
    eager: true,
  })
  city: City;

  @Column()
  street: string;

  @Column()
  house: string;

  @Column({
    nullable: true,
  })
  apartment: string;

  @Column({
    nullable: true,
  })
  entrance: string;

  @Column({
    nullable: true,
  })
  floor: string;

  @ManyToOne(() => Client)
  client: Client;

  @Column({
    nullable: true,
  })
  comment: string;
}
