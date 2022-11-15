import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { Base } from './Base';
import { OrderProduct } from './OrderProduct';
import { Client } from './Client';
import { OrderProfile } from './OrderProfile';

@Entity()
export class Order extends Base {
  @OneToMany(() => OrderProduct, (op) => op.order, {
    onDelete: 'CASCADE',
  })
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

  @Column({
    nullable: true,
  })
  warehouseId: string;
}
