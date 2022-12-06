import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderProduct } from './OrderProduct';
import { Client } from './Client';
import { OrderProfile } from './OrderProfile';
import { OmitType, PartialType } from '@nestjs/swagger';
import { Base } from './Base';
import { PromoCode } from './PromoCode';

@Entity()
export class Order extends PartialType(OmitType(Base, ['id'] as const)) {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => OrderProduct, (op) => op.order, {
    onDelete: 'CASCADE',
  })
  orderProducts: OrderProduct[];

  @ManyToOne(() => Client)
  client: Client;

  @ManyToOne(() => OrderProfile)
  orderProfile: OrderProfile;

  @ManyToOne(() => PromoCode, {
    nullable: true,
  })
  promoCode?: PromoCode;

  @Column({
    type: 'text',
    nullable: true,
  })
  comment?: string;

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

  @Column({
    nullable: true,
    type: 'uuid',
  })
  invoiceUuid: string;
}
