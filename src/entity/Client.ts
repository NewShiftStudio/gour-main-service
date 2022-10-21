import {
  Entity,
  Column,
  ManyToMany,
  ManyToOne,
  JoinTable,
  OneToOne,
  JoinColumn,
  OneToMany,
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
export class Client extends Base {
  @ManyToOne(() => ClientRole, (role) => role.id, {
    eager: true,
  })
  role: number;

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
  city: number;

  @ManyToOne(() => ReferralCode, {
    nullable: true,
    eager: true,
  })
  referralCode: ReferralCode;

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
}

export type IClient = Client;
