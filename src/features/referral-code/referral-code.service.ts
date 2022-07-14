import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, IsNull, Not, Repository } from 'typeorm';
import { ReferralCode } from '../../entity/ReferralCode';
import { getPaginationOptions } from '../../common/helpers/controllerHelpers';
import { BaseGetListDto } from '../../common/dto/base-get-list.dto';
import { ReferralCodeCreateDto } from './dto/ReferralCodeCreateDto';
import { ReferralCodeGetListDto } from './dto/referral-code.get-list.dto';
import { Client } from '../../entity/Client';

@Injectable()
export class ReferralCodeService {
  constructor(
    @InjectRepository(ReferralCode)
    private referralCodeRepository: Repository<ReferralCode>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  findMany(params: BaseGetListDto) {
    return this.referralCodeRepository.find({
      ...getPaginationOptions(params.offset, params.length),
    });
  }

  async getClientStat(params: ReferralCodeGetListDto): Promise<Client[]> {
    const options: FindManyOptions<Client> = {
      ...getPaginationOptions(params.offset, params.length),
      relations: ['referralCode'],
      where: {
        referralCodeId: Not(IsNull()),
      },
    };

    const result = await this.clientRepository.find(options);
    return result.filter((it) => {
      return (
        (params.start ? it.createdAt >= new Date(params.start) : true) &&
        (params.end ? it.createdAt <= new Date(params.end) : true)
      );
    });
  }

  getOne(id: number) {
    return this.referralCodeRepository.findOne({ id });
  }

  async create(referralCode: ReferralCodeCreateDto) {
    try {
      const discount = await this.getDiscount();
      return await this.referralCodeRepository.save({
        discount,
        code: referralCode.code,
      });
    } catch (e) {
      throw new HttpException(e?.driverError?.detail || 'error', 400);
    }
  }

  update(id: number, referralCode: Partial<ReferralCode>) {
    return this.referralCodeRepository.save({
      ...referralCode,
      id,
    });
  }

  remove(id: number) {
    return this.referralCodeRepository.softDelete(id);
  }

  async getDiscount(): Promise<number> {
    return (await this.referralCodeRepository.findOne())?.discount || 0;
  }

  async setDiscount(discount: number) {
    return this.referralCodeRepository.update(
      {},
      {
        discount,
      },
    );
  }
}
