import { Entity, Column, ManyToOne } from 'typeorm';
import { AppEntity } from './AppEntity';
import { City } from './City';
import { Client } from './Client';

@Entity()
export class OrderProfile extends AppEntity {
  @Column()
  title: string;

  @ManyToOne(() => City)
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
