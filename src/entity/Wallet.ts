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
import { WalletTransaction } from './WalletTransaction';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @OneToOne(() => Client)
  @JoinColumn()
  client: Client;

  @Column()
  value: number;

  @Column({ select: false })
  signature: string;

  @OneToMany(() => WalletTransaction, (wc) => wc.wallet)
  transactions: WalletTransaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
