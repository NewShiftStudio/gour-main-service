import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { AppEntity } from './AppEntity';
import { OrderProduct } from './OrderProduct';
import { Client } from './Client';
import { OrderProfile } from './OrderProfile';
import { ApiProperty } from '@nestjs/swagger';

export enum OrderStatus {
  init = 'init',
  basketFilling = 'basketFilling',
  registration = 'registration',
  payment = 'payment',
  paid = 'paid',
  atThePointOfIssue = 'atThePointOfIssue',
  delivery = 'delivery',
  completed = 'completed',
  rejected = 'rejected',
}

@Entity()
export class Order extends AppEntity {
  @Column({
    type: 'enum',
    enum: OrderStatus,
  })
  @ApiProperty({
    enum: OrderStatus,
  })
  status: OrderStatus;

  @OneToMany(() => OrderProduct, (op) => op.order)
  orderProducts: OrderProduct[];

  @ManyToOne(() => Client)
  client: Client;

  @ManyToOne(() => OrderProfile)
  orderProfile: OrderProfile;

  @Column({
    type: 'text',
  })
  comment: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column({
    nullable: true,
  })
  leadId: number;
}
