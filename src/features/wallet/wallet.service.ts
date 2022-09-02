import {
  HttpException,
  HttpStatus,
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
        throw new Error('Implements currency USD');
      case Currency.EUR:
        throw new Error('Implements currency EUR');
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
    if (!wallet) throw new NotFoundException();
    return wallet;
  }

  async getByClientId(id: number): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({
      client: {
        id,
      },
    });

    // TODO не у всех есть кошелёк
    // if (!wallet) throw new NotFoundException();

    return wallet;
  }

  async getBalanceByClientId(id: number): Promise<number> {
    const wallet = await this.getByClientId(id);
    return wallet ? wallet.value : 0;
  }

  async useCoins(uuid: string, value: number) {
    const wallet = await this.getById(uuid);

    if (!wallet) throw new NotFoundException();
    if (wallet.value < value) {
      throw new HttpException('Insufficient funds', HttpStatus.BAD_REQUEST);
    }

    await this.walletRepository.save({
      uuid,
      value: wallet.value - value,
    });

    return this.getById(uuid);
  }
}
