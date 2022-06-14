import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from '../../entity/Wallet';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  checkSignature() {
    return true;
  }

  async changeSum(uuid: string, value: number) {
    await this.walletRepository.save({
      value,
      uuid,
    });

    return this.getById();
  }

  getById(uuid = 'd9d7ba2c-009d-4d2e-928b-116706e632d2') {
    return this.walletRepository.findOne(uuid);
  }

  async useCoins(uuid: string, value: number) {
    const wallet = await this.walletRepository.findOne(uuid);
    await this.walletRepository.save({
      uuid,
      value: wallet.value - value,
    });

    return this.walletRepository.findOne(uuid);
  }
}
