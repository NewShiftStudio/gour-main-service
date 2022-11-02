import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import {
  WalletTransaction,
  WalletTransactionStatus,
  WalletTransactionType,
} from 'src/entity/WalletTransaction';
import { Equal, Repository } from 'typeorm';

import { Wallet } from '../../entity/Wallet';
import {
  decodeToken,
  encodeJwt,
  signTsx,
  verifyJwt,
} from '../auth/jwt.service';
import { ClientsService } from '../client/client.service';
import { createWalletTransactionDto } from './dto/create-transaction.dto';
import { InvoiceDto, InvoiceStatus } from './dto/invoice.dto';
import { WalletBuyCoinsDto } from './dto/wallet-buy-coins.dto';
import { WalletReplenishBalanceDto } from './dto/wallet-replenish-balance.dto';

export enum Currency {
  RUB = 'RUB',
  USD = 'USD',
  EUR = 'EUR',
}

@Injectable()
export class WalletService {
  constructor(
    @Inject('PAYMENT_SERVICE') private client: ClientProxy,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(WalletTransaction)
    private transactionRepository: Repository<WalletTransaction>,
    private clientService: ClientsService,
  ) {}

  async onModuleInit() {
    await this.client.connect();
  }

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

  async getById(uuid: string): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne(uuid);

    if (!wallet) throw new NotFoundException('Кошелёк не найден');

    return wallet;
  }

  async buyCoins(dto: WalletBuyCoinsDto) {
    const client = await this.clientService.findOne(dto.payerUuid);
    if (!client) throw new NotFoundException('Пользователь не найден');

    const clientWallet = await this.getByClientId(client.id);
    const wallet = clientWallet ? clientWallet : await this.create(client.id);

    try {
      const invoice = await firstValueFrom(
        this.client.send<InvoiceDto>('get-invoice', {
          uuid: dto.invoiceUuid,
        }),
      );

      if (!invoice) {
        throw new NotFoundException('Счет не найден');
      }

      const replenishBalancePayload = {
        walletUuid: wallet.uuid,
        amount: invoice.amount,
        signature: wallet.signature,
      };

      const paymentData = {
        currency: dto.currency,
        email: dto.email,
        invoiceUuid: dto.invoiceUuid,
        payerUuid: client.id,
        ipAddress: dto.ipAddress,
        signature: dto.signature,
        successUrl: `${process.env.REPLENISH_BALANCE_URL}?authToken=${encodeJwt(
          replenishBalancePayload,
          process.env.SIGNATURE_SECRET,
          '5m',
        )}`,
        rejectUrl: process.env.REJECT_REDIRECT_URL_BUY_COINS,
      };

      const data = await firstValueFrom(
        this.client.send<InvoiceDto, WalletBuyCoinsDto>('pay', paymentData),
      );

      if (data.redirectUri) {
        return {
          redirect: data.redirectUri,
        };
      }

      return data;
    } catch (error) {
      throw new HttpException(
        `Ошибка при оплате: ${error?.message || ''}`,
        error?.status,
      );
    }
  }

  async replenishBalanceByToken(token: string): Promise<{ redirect: string }> {
    const dto = decodeToken(token) as WalletReplenishBalanceDto;

    const wallet = await this.getById(dto.walletUuid);

    try {
      if (!wallet) {
        throw new BadRequestException('Кошелек не найден');
      }

      if (!verifyJwt(token, process.env.SIGNATURE_SECRET)) {
        throw new ForbiddenException('Токен не действителен');
      }

      if (wallet.signature !== dto.signature) {
        throw new ForbiddenException('Токен не действителен');
      }

      await this.addCoins(
        dto.walletUuid,
        +dto.amount,
        'Пополнение баланса кошелька',
      );

      return {
        redirect: `${process.env.SUCCESS_REDIRECT_URL_BUY_COINS}&amount=${dto.amount}`,
      };
    } catch (error) {
      console.error(error);
      return {
        redirect: process.env.REJECT_REDIRECT_URL_BUY_COINS,
      };
    }
  }

  async createWalletTransaction(
    dto: createWalletTransactionDto,
    repository?: Repository<WalletTransaction>,
  ) {
    const transactionRepository = repository
      ? repository
      : this.transactionRepository;
    return transactionRepository.save(dto);
  }

  async getWalletTransactionsByClientId(clientId: string) {
    const client = await this.clientService.findOne(clientId);
    if (!client) {
      throw new NotFoundException('Пользователь не найден');
    }
    const wallet = await this.getByClientId(client.id);

    return this.transactionRepository.find({
      where: {
        wallet: { uuid: wallet.uuid },
        status: Equal(WalletTransactionStatus.approved),
      },
    });
  }

  signTsx(signatureObject: object) {
    return signTsx(signatureObject);
  }

  async changeSum(
    uuid: string,
    value: number,
    description: string,
  ): Promise<WalletTransaction> {
    const wallet = await this.getById(uuid);

    if (!wallet) {
      throw new NotFoundException('Кошелек не найден');
    }

    await this.walletRepository.save({
      value,
      uuid,
    });

    const updatedWallet = await this.getById(uuid);

    const signatureObject = {
      newValue: value,
      prevValue: wallet.value,
      status: WalletTransactionStatus.approved,
      type:
        updatedWallet.value > wallet.value
          ? WalletTransactionType.income
          : WalletTransactionType.expense,
      walletUuid: wallet.uuid,
    };

    const signature = this.signTsx(signatureObject);

    return this.createWalletTransaction({
      ...signatureObject,
      wallet,
      description,
      signature,
    });
  }

  async getByClientId(uuid: string): Promise<Wallet> {
    return await this.walletRepository.findOne({
      client: {
        id: uuid,
      },
    });
  }

  async getBalanceByClientId(uuid: string): Promise<number> {
    const wallet = await this.getByClientId(uuid);
    return wallet ? wallet.value : 0;
  }

  async create(userUuid: string): Promise<Wallet> {
    const signature = this.signTsx({
      clientId: userUuid,
    });
    return this.walletRepository.save({
      value: 0,
      client: { id: userUuid },
      signature,
    });
  }

  async useCoins(
    uuid: string,
    value: number,
    description: string,
    walletRepository?: Repository<Wallet>,
    transactionRepository?: Repository<WalletTransaction>,
  ): Promise<WalletTransaction> {
    const wallet = await this.getById(uuid);

    const currentWalletRepository = walletRepository
      ? walletRepository
      : this.walletRepository;

    const currentTransactionRepository = transactionRepository
      ? transactionRepository
      : this.transactionRepository;

    if (!wallet) throw new NotFoundException('Кошелёк не найден');
    if (wallet.value < value)
      throw new BadRequestException('Недостаточно средств');

    const newValue = wallet.value - value;
    if (Number.isNaN(newValue)) {
      throw new BadRequestException('Некорректный тип суммы');
    }

    await currentWalletRepository.save({
      uuid,
      value: newValue,
      signature: this.signTsx({ newValue, uuid: wallet.uuid }),
    });

    const signatureObject = {
      prevValue: wallet.value,
      newValue,
      status: WalletTransactionStatus.approved,
      type: WalletTransactionType.expense,
      walletUuid: uuid,
    };

    const signature = this.signTsx(signatureObject);

    return this.createWalletTransaction(
      {
        ...signatureObject,
        wallet,
        description,
        signature,
      },
      currentTransactionRepository,
    );
  }

  async addCoins(
    uuid: string,
    value: number,
    description: string,
  ): Promise<WalletTransaction> {
    const wallet = await this.getById(uuid);

    if (!wallet) throw new NotFoundException('Кошелёк не найден');

    const newValue = wallet.value + value;

    if (Number.isNaN(newValue)) {
      throw new BadRequestException('Некорректный тип суммы');
    }

    await this.walletRepository.save({
      uuid,
      value: newValue,
      signature: this.signTsx({ newValue, uuid: wallet.uuid }),
    });

    const signatureObject = {
      prevValue: wallet.value,
      newValue,
      status: WalletTransactionStatus.approved,
      type: WalletTransactionType.income,
      walletUuid: wallet.uuid,
    };

    const signature = this.signTsx(signatureObject);

    return this.createWalletTransaction({
      ...signatureObject,
      wallet,
      signature,
      description,
    });
  }
}
