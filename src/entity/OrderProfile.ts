import { Entity, Column, ManyToOne } from 'typeorm';
import { AppEntity } from './AppEntity';
import { City } from './City';
import { Client } from './Client';

@Entity()
export class OrderProfile extends AppEntity {
  @Column()
  title: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @ManyToOne(() => City)
  city: City;

  @Column()
  deliveryType: string;

  @Column()
  address: string;

  @ManyToOne(() => Client)
  client: Client;
}
