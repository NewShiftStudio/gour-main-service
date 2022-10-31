import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Promotion } from '../../entity/Promotion';
import { getPaginationOptions } from '../../common/helpers/controllerHelpers';
import { PromotionCreateDto } from './dto/promotion-create.dto';
import { PromotionUpdateDto } from './dto/promotion-update.dto';
import { BaseGetListDto } from '../../common/dto/base-get-list.dto';
import { Image } from '../../entity/Image';
import { Product } from '../../entity/Product';

@Injectable()
export class PromotionService {
  constructor(
    @InjectRepository(Promotion)
    private promotionRepository: Repository<Promotion>,

    @InjectRepository(Image)
    private imageRepository: Repository<Image>,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  findMany(params: BaseGetListDto) {
    return this.promotionRepository.findAndCount({
      ...getPaginationOptions(params.offset, params.length),
    });
  }

  async getOne(id: number) {
    const promotion = this.promotionRepository
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

    return promotion;
  }

  async create(promotionDto: any | PromotionCreateDto) {
    const cardImage = await this.imageRepository.findOne(
      promotionDto.cardImageId,
    );

    if (!cardImage) {
      throw new NotFoundException('Фото 1:2 не найдено');
    }

    const pageImage = await this.imageRepository.findOne(
      promotionDto.pageImageId,
    );

    if (!pageImage) {
      throw new NotFoundException('Фото 1:1 не найдено');
    }

    return this.promotionRepository.save({
      ...promotionDto,
      cardImage,
      pageImage,
      products: await this.productRepository.findByIds(promotionDto.products),
    });
  }

  async update(id: number, dto: PromotionUpdateDto) {
    const promotion = await this.promotionRepository.findOne(id);

    if (!promotion) throw new NotFoundException('Акция не найдена');

    let cardImage: Image | undefined;
    let pageImage: Image | undefined;
    let products: Product[] = [];

    if (dto.cardImageId) {
      cardImage = await this.imageRepository.findOne(dto.cardImageId);

      if (!cardImage) throw new NotFoundException('Фото 1:2 не найдено');
    }

    if (dto.pageImageId) {
      pageImage = await this.imageRepository.findOne(dto.pageImageId);

      if (!pageImage) throw new NotFoundException('Фото 1:1 не найдено');
    }

    if (dto.products)
      products = await this.productRepository.findByIds(dto.products);

    return this.promotionRepository.save({
      ...promotion,
      ...dto,
      cardImage,
      pageImage,
      products,
    });
  }

  remove(id: number) {
    return this.promotionRepository.delete(id);
  }
}
