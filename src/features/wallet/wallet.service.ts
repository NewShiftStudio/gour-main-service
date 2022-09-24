import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Wallet } from '../../entity/Wallet';

export enum Currency {
  RUB = 'RUB',
  USD = 'USD',
  EUR = 'EUR',
}

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  checkSignature() {
    // TODO: implement this logic
    return true;
  }

  getAmountByCurrency(count: number, currency: Currency) {
    switch (currency) {
      case Currency.RUB:
        return count * 1; // одна сырная монета = 1 рубль
      case Currency.USD:
        throw new Error('Реализуйте валюту USD');
      case Currency.EUR:
        throw new Error('Реализуйте валюту EUR');
    }
  }

  async changeSum(uuid: string, value: number): Promise<Wallet> {
    await this.getById(uuid);
    await this.walletRepository.save({
      value,
      uuid,
    });
    return this.getById(uuid);
  }

  getById(uuid: string): Promise<Wallet> {
    const wallet = this.walletRepository.findOne(uuid);

    if (!wallet) throw new NotFoundException('Кошелёк не найден');

    return wallet;
  }

  async getByClientId(id: number): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({
      client: {
        id,
      },
    });

    if (!wallet) throw new NotFoundException('Кошелёк не найден');

    return wallet;
  }

  async getBalanceByClientId(id: number): Promise<number> {
    const wallet = await this.getByClientId(id);

    return wallet ? wallet.value : 0;
  }

  async useCoins(uuid: string, value: number) {
    const wallet = await this.getById(uuid);

    if (!wallet) throw new NotFoundException('Кошелёк не найден');
    if (wallet.value < value)
      throw new BadRequestException('Недостаточно средств');

    await this.walletRepository.save({
      uuid,
      value: wallet.value - value,
    });

    return this.getById(uuid);
  }
}
