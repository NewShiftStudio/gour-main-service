import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  ManyToMany,
  ManyToOne,
  JoinTable,
  OneToOne,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

import { Base } from './Base';
import { ClientRole } from './ClientRole';
import { Product } from './Product';
import { City } from './City';
import { ReferralCode } from './ReferralCode';
import { Image } from './Image';
import { Wallet } from './Wallet';
import { Discount } from './Discount';

@Entity()
export class Client {
  @ManyToOne(() => ClientRole, {
    eager: true,
  })
  role: ClientRole;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    default: false,
  })
  isApproved: boolean;

  @Column({
    type: 'json',
    default: '{}',
  })
  additionalInfo: Record<string, string | number | object>;

  @ManyToMany(() => Product)
  @JoinTable()
  favorites: Product[];

  @Column({
    default: '',
  })
  firstName: string;

  @Column({
    default: '',
  })
  lastName: string;

  @Column({
    default: '',
  })
  phone: string;

  @Column({
    default: '',
  })
  email: string;

  @OneToMany(() => Discount, (discount) => discount.client, {
    cascade: true,
  })
  discounts: Discount[];

  @ManyToOne(() => City, (city) => city.id, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  city: City;

  @ManyToOne(() => ReferralCode, {
    nullable: true,
    eager: true,
  })
  referralCode: ReferralCode;

  @Exclude()
  @Column({
    default: '',
  })
  password: string;

  @ManyToOne(() => Image, (image) => image.id, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  avatar: number;

  @Column({
    default: null,
  })
  mainOrderProfileId: number;

  @OneToOne(() => Wallet, {
    nullable: true,
  })
  @JoinColumn()
  wallet: Wallet;

  @Column({
    default: 1,
  })
  lives: number;

  @Column({ type: 'uuid', nullable: true })
  warehouseClientId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ default: null })
  deletedAt?: Date;
}

export type IClient = Client;
