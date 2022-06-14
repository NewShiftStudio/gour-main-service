import { Wallet } from './Wallet';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum WalletChangeType {
  income = 'income',
  expense = 'expense',
}

export enum WalletChangeStatus {
  init = 'init',
  approved = 'approved',
  rejected = 'rejected',
}

@Entity()
export class WalletChange {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ManyToOne(() => Wallet)
  wallet: Wallet;

  @Column({
    type: 'enum',
    enum: WalletChangeType,
  })
  type: WalletChangeType;

  @Column({
    type: 'enum',
    enum: WalletChangeStatus,
  })
  status: WalletChangeStatus;

  @Column()
  secretToken: string;

  @Column()
  prevValue: number;

  @Column()
  newValue: number;

  @Column({
    type: 'text',
  })
  description: string;

  @Column()
  signature: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
