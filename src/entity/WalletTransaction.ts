import { Wallet } from './Wallet';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum WalletTransactionType {
  income = 'income',
  expense = 'expense',
}

export enum WalletTransactionStatus {
  init = 'init',
  approved = 'approved',
  rejected = 'rejected',
}

@Entity()
export class WalletTransaction {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ManyToOne(() => Wallet)
  wallet: Wallet;

  @Column({
    type: 'enum',
    enum: WalletTransactionType,
  })
  type: WalletTransactionType;

  @Column({
    type: 'enum',
    enum: WalletTransactionStatus,
  })
  status: WalletTransactionStatus;

  @Column()
  prevValue: number;

  @Column()
  newValue: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({ select: false })
  signature: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
