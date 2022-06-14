import { Client } from './Client';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WalletChange } from './WalletChange';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @OneToOne(() => Client)
  @JoinColumn()
  client: Client;

  @Column()
  value: number;

  @Column()
  signature: string;

  @OneToMany(() => WalletChange, (wc) => wc.wallet)
  changes: WalletChange[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
