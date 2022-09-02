import {
  Entity,
  Column,
  ManyToMany,
  ManyToOne,
  JoinTable,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { AppEntity } from './AppEntity';
import { ClientRole } from './ClientRole';
import { Product } from './Product';
import { City } from './City';
import { ReferralCode } from './ReferralCode';
import { Image } from './Image';
import { OrderProfile } from './OrderProfile';
import { Wallet } from './Wallet';
import { Exclude } from 'class-transformer';

@Entity()
export class Client extends AppEntity {
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

  @ManyToOne(() => City, (city) => city.id, {
    eager: true,
    nullable: true,
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
  @Exclude()
  password: string;

  @OneToOne(() => Image, {
    nullable: true,
    eager: true,
  })
  @JoinColumn()
  avatar: Image;

  @OneToOne(() => OrderProfile, {
    nullable: true,
  })
  @JoinColumn()
  mainOrderProfile: OrderProfile;

  @OneToOne(() => Wallet, {
    nullable: true,
  })
  @JoinColumn()
  wallet: Wallet;

  @Column({
    default: 3,
  })
  lives: number;
}

export type IClient = Client;
