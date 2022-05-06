import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReferralCode } from '../../entity/ReferralCode';
import { getPaginationOptions } from '../../common/helpers/controllerHelpers';
import { BaseGetListDto } from '../../common/dto/BaseGetListDto';
import { ReferralCodeCreateDto } from './dto/ReferralCodeCreateDto';

@Injectable()
export class ReferralCodeService {
  constructor(
    @InjectRepository(ReferralCode)
    private referralCodeRepository: Repository<ReferralCode>,
  ) {}

  findMany(params: BaseGetListDto) {
    return this.referralCodeRepository.find({
      ...getPaginationOptions(params.offset, params.length),
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
