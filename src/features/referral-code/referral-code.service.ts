import {
  BadRequestException,
  Injectable,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, IsNull, Not, Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ExportDto } from 'src/common/dto/export.dto';
import { VolumeDto } from './dto/volume.dto';

import { ReferralCode } from '../../entity/ReferralCode';
import { Order } from '../../entity/Order';
import { getPaginationOptions } from '../../common/helpers/controllerHelpers';
import { BaseGetListDto } from '../../common/dto/base-get-list.dto';
import { ReferralCodeCreateDto } from './dto/referral-code-create.dto';
import { Client } from '../../entity/Client';
import { ReferralCodeEditDto } from './dto/referral-code-edit.dto';

@Injectable()
export class ReferralCodeService {
  constructor(
    @InjectRepository(ReferralCode)
    private referralCodeRepository: Repository<ReferralCode>,

    @InjectRepository(Client)
    private clientRepository: Repository<Client>,

    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @Inject('PAYMENT_SERVICE') private client: ClientProxy,
  ) {}

  async onModuleInit() {
    await this.client.connect();
  }

  findMany(params: BaseGetListDto) {
    return this.referralCodeRepository.find({
      ...getPaginationOptions(params.offset, params.length),
    });
  }

  async getReferrals(
    params: BaseGetListDto,
    dto?: ExportDto,
  ): Promise<[Client[], number]> {
    const options: FindManyOptions<Client> = {
      where: {
        referralCode: Not(IsNull()),
      },
    };

    let referrals = await this.clientRepository.find(options);

    if (!referrals) throw new NotFoundException('Рефералы не найдены');

    const startDate = dto?.start && new Date(dto.start);
    const endDate = dto?.end && new Date(dto.end);

    const sliceStart = params?.offset && Number(params.offset);
    const sliceEnd = params?.length && sliceStart + Number(params.length);

    if (startDate || endDate) {
      referrals = referrals.filter((referralCode) => {
        const isStartMatches = startDate
          ? startDate <= referralCode.createdAt
          : true;
        const isEndMatches = endDate ? endDate >= referralCode.createdAt : true;

        return isStartMatches && isEndMatches;
      });

      if (!referrals.length)
        throw new NotFoundException('Рефералы за указанный период не найдены');
    }

    if (sliceStart || sliceEnd) {
      referrals = referrals.slice(sliceStart, sliceEnd);
    }

    return [referrals, referrals.length];
  }

  async getVolume(dto?: ExportDto): Promise<[VolumeDto[], number]> {
    const foundClients = await this.clientRepository
      .createQueryBuilder('client')
      .leftJoinAndSelect('client.referralCode', 'referralCode')
      .where('client.referralCode IS NOT NULL')
      .getMany();

    if (!foundClients) throw new NotFoundException('Рефералы не найдены');

    const successPayments = await firstValueFrom(
      this.client.send('success-payments', dto || {}),
    );

    const normalizedClients = foundClients.reduce((acc, client) => ({ ...acc, [client.id]: client }), {});

    const referralPayments = successPayments.reduce((acc, payment: { amount: number; payerUuid: string; }) => {
      const { amount, payerUuid } = payment;
      const client = normalizedClients[payerUuid];

      if (client?.referralCode) {
        acc.push({
          clientName: `${client.firstName} ${client.lastName}`,
          code: client.referralCode.code || 'Code has been deleted or not found',
          amount,
          clientId: payerUuid,
        });
      }

      return acc;
    }, []);

    return [referralPayments, referralPayments.length];
  }

  getOne(id: number) {
    return this.referralCodeRepository.findOne({ id });
  }

  async create(dto: ReferralCodeCreateDto) {
    const discount = await this.getDiscount();

    const referralCode = await this.referralCodeRepository.save({
      discount,
      code: dto.code,
      fullName: dto.fullName,
      phone: dto.phone,
    });

    return referralCode;
  }

  update(id: number, dto: ReferralCodeEditDto) {
    return this.referralCodeRepository.save({
      ...dto,
      id,
    });
  }

  remove(id: number) {
    return this.referralCodeRepository.softDelete(id);
  }

  async getDiscount(): Promise<number> {
    const referralCode = await this.referralCodeRepository.findOne();
    const discount = referralCode?.discount || 0;

    return discount;
  }

  async setDiscount(discount: number) {
    await this.referralCodeRepository.update(
      {},
      {
        discount,
      },
    );

    const updatedDiscount = await this.getDiscount();

    if (discount !== updatedDiscount)
      throw new BadRequestException('Не удалось изменить размер скидки');

    return discount;
  }
}
