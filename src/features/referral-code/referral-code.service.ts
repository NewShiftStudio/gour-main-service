import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, IsNull, Not, Repository } from 'typeorm';

import { ReferralCode } from '../../entity/ReferralCode';
import { getPaginationOptions } from '../../common/helpers/controllerHelpers';
import { BaseGetListDto } from '../../common/dto/base-get-list.dto';
import { ReferralCodeCreateDto } from './dto/referral-code-create.dto';
import { ReferralCodeGetListDto } from './dto/referral-code-get-list.dto';
import { Client } from '../../entity/Client';
import { ReferralCodeEditDto } from './dto/referral-code-edit.dto';

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

  async getReferrals(params: ReferralCodeGetListDto): Promise<Client[]> {
    const options: FindManyOptions<Client> = {
      ...getPaginationOptions(params.offset, params.length),
      relations: ['referralCode'],
      where: {
        referralCodeId: Not(IsNull()),
      },
    };

    const result = await this.clientRepository.find(options);

    return result.filter(
      (it) =>
        (params.start ? it.createdAt >= new Date(params.start) : true) &&
        (params.end ? it.createdAt <= new Date(params.end) : true),
    );
  }

  getOne(id: number) {
    return this.referralCodeRepository.findOne({ id });
  }

  async create(dto: ReferralCodeCreateDto) {
    const discount = await this.getDiscount();

    const referralCode = await this.referralCodeRepository.save({
      discount,
      code: dto.code,
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
    return this.referralCodeRepository.update(
      {},
      {
        discount,
      },
    );
  }
}
