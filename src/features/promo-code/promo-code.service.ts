import { Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PromoCode } from 'src/entity/PromoCode';
import { PromoCodeCreateDto } from './dto/promo-code-create.dto';
import { PromoCodeUpdateDto } from './dto/promo-code-update.dto';
import { Category } from 'src/entity/Category';
import { PromoCodeCheckDto } from './dto/promo-code-check.dto';

import { ExportDto } from 'src/common/dto/export.dto';
import { BaseGetListDto } from 'src/common/dto/base-get-list.dto';

@Injectable()
export class PromoCodeService {
  constructor(
    @InjectRepository(PromoCode)
    private promoCodeRepository: Repository<PromoCode>,

    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findMany(
    params: BaseGetListDto,
    dto?: ExportDto,
  ): Promise<[PromoCode[], number]> {
    let promoCodes = await this.promoCodeRepository.find();

    if (!promoCodes) throw new NotFoundException('Промокоды не найдены');

    const startDate = dto?.start && new Date(dto.start);
    const endDate = dto?.end && new Date(dto.end);

    const sliceStart = params?.offset && Number(params.offset);
    const sliceEnd = params?.length && sliceStart + Number(params.length);

    if (startDate || endDate) {
      promoCodes = promoCodes.filter((promoCode) => {
        const isStartMatches = startDate
          ? startDate <= promoCode.createdAt
          : true;
        const isEndMatches = endDate ? endDate >= promoCode.createdAt : true;

        return isStartMatches && isEndMatches;
      });

      if (!promoCodes.length)
        throw new NotFoundException('Промокоды за указанный период не найдены');
    }

    if (sliceStart || sliceEnd) {
      promoCodes = promoCodes.slice(sliceStart, sliceEnd);
    }

    return [promoCodes, promoCodes.length];
  }

  getOne(id: number) {
    return this.promoCodeRepository.findOne({ id });
  }

  async create({
    key,
    discount,
    end,
    totalCount,
    countForOne,
    categoryIds,
  }: PromoCodeCreateDto) {
    const categories = await this.categoryRepository.findByIds(categoryIds);

    if (!categories) throw new NotFoundException('Категории не найдены');

    return this.promoCodeRepository.save({
      key,
      discount,
      end,
      totalCount,
      countForOne,
      categories,
    });
  }

  async update(
    id: number,
    {
      key,
      discount,
      end,
      totalCount,
      countForOne,
      categoryIds,
    }: PromoCodeUpdateDto,
  ) {
    const categories = await this.categoryRepository.findByIds(categoryIds);

    if (!categories) throw new NotFoundException('Категории не найдены');

    return this.promoCodeRepository.save({
      id,
      key,
      discount,
      end,
      totalCount,
      countForOne,
      categories,
    });
  }

  async apply({ key }: PromoCodeCheckDto, clientId: string) {
    const promoCode = await this.promoCodeRepository
      .createQueryBuilder('promoCode')
      .leftJoinAndSelect('promoCode.categories', 'categories')
      .leftJoinAndSelect('promoCode.orders', 'orders')
      .leftJoinAndSelect('orders.client', 'client')
      .where('promoCode.key = :key', { key })
      .getOne();

    if (!promoCode) throw new NotFoundException('Промокод не найден');

    const now = new Date();
    const end = new Date(promoCode.end);

    if (now > end) throw new BadRequestException('Промокод истёк');

    if (promoCode.orders.length >= promoCode.totalCount)
      throw new BadRequestException('Кол-во промокодов закончилось');

    const clientOrders = promoCode.orders?.filter(
      (order) => order.client.id === clientId,
    );

    if (clientOrders.length >= promoCode.countForOne)
      throw new BadRequestException(
        'Вы больше не можете использовать данный промокод',
      );

    return promoCode;
  }

  remove(id: number) {
    return this.promoCodeRepository.delete(id);
  }
}
