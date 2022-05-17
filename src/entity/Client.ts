import {
  Entity,
  Column,
  ManyToMany,
  ManyToOne,
  Index,
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

@Entity()
export class Client extends AppEntity {
  @ManyToOne(() => ClientRole, {
    eager: true,
  })
  role: ClientRole;

  @Column()
  roleId: number;

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
  name: string;

  @Column({
    default: '',
  })
  phone: string;

  @ManyToOne(() => City, {
    eager: true,
    nullable: true,
  })
  city: City;

  @Column({
    nullable: true,
  })
  cityId: number;

  @ManyToOne(() => ReferralCode, {
    nullable: true,
    eager: true,
  })
  referralCode: ReferralCode;

  @Column({
    nullable: true,
  })
  referralCodeId: number;

  @Column({
    default: '',
  })
  password: string;

  @OneToOne(() => Image, {
    nullable: true,
    eager: true,
  })
  @JoinColumn()
  avatar: Image;

  @Column({
    nullable: true,
  })
  avatarId: number;
}

export type IClient = Client;
