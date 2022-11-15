import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderProduct } from './OrderProduct';
import { Client } from './Client';
import { OrderProfile } from './OrderProfile';

@Entity()
export class Order {
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

  @Column({
    nullable: true,
  })
  invoiceUuid: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ default: null })
  deletedAt?: Date;
}
