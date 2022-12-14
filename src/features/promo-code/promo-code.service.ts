import { Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PromoCode } from 'src/entity/PromoCode';
import { BaseGetListDto } from 'src/common/dto/base-get-list.dto';
import { PromoCodeCreateDto } from './dto/promo-code-create.dto';
import { PromoCodeUpdateDto } from './dto/promo-code-update.dto';
import { getPaginationOptions } from 'src/common/helpers/controllerHelpers';
import { Category } from 'src/entity/Category';
import { PromoCodeCheckDto } from './dto/promo-code-check.dto';

@Injectable()
export class PromoCodeService {
  constructor(
    @InjectRepository(PromoCode)
    private promoCodeRepository: Repository<PromoCode>,

    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  findMany(params: BaseGetListDto) {
    return this.promoCodeRepository.findAndCount({
      ...getPaginationOptions(params.offset, params.length),
    });
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
