import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Promotion } from '../../entity/Promotion';
import { getPaginationOptions } from '../../common/helpers/controllerHelpers';
import { PromotionCreateDto } from './dto/promotion-create.dto';
import { PromotionUpdateDto } from './dto/promotion-update.dto';
import { BaseGetListDto } from '../../common/dto/base-get-list.dto';
import { Image } from '../../entity/Image';
import { Product } from '../../entity/Product';
import { WarehouseService } from '../warehouse/warehouse.service';

@Injectable()
export class PromotionService {
  constructor(
    @InjectRepository(Promotion)
    private promotionRepository: Repository<Promotion>,

    @InjectRepository(Image)
    private imageRepository: Repository<Image>,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @Inject(WarehouseService) readonly warehouseService: WarehouseService,
  ) {}

  findMany(params: BaseGetListDto) {
    return this.promotionRepository.findAndCount({
      ...getPaginationOptions(params.offset, params.length),
    });
  }

  async getOne(id: number) {
    const promotion = await this.promotionRepository
      .createQueryBuilder('promotion')
      .leftJoinAndSelect('promotion.title', 'promotionTitle')
      .leftJoinAndSelect('promotion.description', 'description')
      .leftJoinAndSelect('promotion.cardImage', 'cardImage')
      .leftJoinAndSelect('promotion.pageImage', 'pageImage')
      .leftJoinAndSelect('promotion.pageMeta', 'pageMeta')
      .leftJoinAndSelect('promotion.products', 'products')
      .leftJoinAndSelect('products.title', 'productTitle')
      .leftJoinAndSelect('products.price', 'productPrice')
      .leftJoinAndSelect('products.images', 'productImages')
      .leftJoinAndSelect('products.categories', 'categories')
      .leftJoinAndSelect('categories.title', 'categoryTitle')
      .leftJoinAndSelect('categories.subCategories', 'categorySubCategories')
      .leftJoinAndSelect(
        'categories.parentCategories',
        'category.parentCategories',
      )
      .where('promotion.id = :id', { id })
      .getOne();

    const quantityByProduct =  await this.warehouseService.getQuantityByAssortmentIds(
        promotion.products.filter((p) => p.isWeighed).map((p) => p.moyskladId),
        'Санкт-Петербург'
    );

    for (const product of promotion.products) {
      const weight = quantityByProduct[product.moyskladId]
      if (weight !== undefined) {
        product.weight = weight * 1000;
      }
    }

    return promotion;
  }

  async create({
    title,
    description,
    cardImageId,
    pageImageId,
    start,
    end,
    discount,
    pageMeta,
    products: productIds,
  }: PromotionCreateDto) {
    let cardImage: Image | undefined;
    let pageImage: Image | undefined;

    if (cardImageId) {
      cardImage = await this.imageRepository.findOne(cardImageId);

      if (!cardImage) throw new NotFoundException('Фото 1:2 не найдено');
    }

    if (pageImageId) {
      pageImage = await this.imageRepository.findOne(pageImageId);

      if (!pageImage) throw new NotFoundException('Фото 1:1 не найдено');
    }

    const products = await this.productRepository.findByIds(productIds);

    if (!products) throw new NotFoundException('Продукты не найдены');

    return this.promotionRepository.save({
      title,
      description,
      cardImage,
      pageImage,
      start,
      end,
      discount,
      pageMeta,
      products,
    });
  }

  async update(
    id: number,
    {
      title,
      description,
      cardImageId,
      pageImageId,
      start,
      end,
      discount,
      pageMeta,
      products: productIds,
    }: PromotionUpdateDto,
  ) {
    const promotion = await this.promotionRepository.findOne(id);

    if (!promotion) throw new NotFoundException('Акция не найдена');

    let cardImage: Image | undefined;
    let pageImage: Image | undefined;
    let products: Product[] = [];

    if (cardImageId) {
      cardImage = await this.imageRepository.findOne(cardImageId);

      if (!cardImage) throw new NotFoundException('Фото 1:2 не найдено');
    }

    if (pageImageId) {
      pageImage = await this.imageRepository.findOne(pageImageId);

      if (!pageImage) throw new NotFoundException('Фото 1:1 не найдено');
    }

    if (productIds) {
      products = await this.productRepository.findByIds(productIds);

      if (!products) throw new NotFoundException('Товары не найдены');
    }

    return this.promotionRepository.save({
      ...promotion,
      title,
      description,
      cardImage,
      pageImage,
      start,
      end,
      discount,
      pageMeta,
      products,
    });
  }

  remove(id: number) {
    return this.promotionRepository.delete(id);
  }
}
