import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promotion } from '../../entity/Promotion';
import { getPaginationOptions } from '../../common/helpers/controllerHelpers';
import { PromotionCreateDto } from './dto/promotion.create.dto';
import { PromotionUpdateDto } from './dto/promotion.update.dto';
import { BaseGetListDto } from '../../common/dto/BaseGetListDto';
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
    return this.promotionRepository.findOne({ id });
  }

  async create(promotionDto: PromotionCreateDto) {
    const cardImage = await this.imageRepository.findOne(
      promotionDto.cardImageId,
    );
    if (!cardImage) {
      throw new HttpException('cardImage was not found', 400);
    }
    const pageImage = await this.imageRepository.findOne(
      promotionDto.pageImageId,
    );

    if (!pageImage) {
      throw new HttpException('pageImage was not found', 400);
    }
    return this.promotionRepository.save({
      ...promotionDto,
      cardImage,
      pageImage,
      products: await this.productRepository.findByIds(promotionDto.products),
    });
  }

  async update(id: number, promotionDto: PromotionUpdateDto) {
    let cardImage: Image | undefined;
    let pageImage: Image | undefined;
    let products: Product[] = [];
    if (promotionDto.cardImageId) {
      cardImage = await this.imageRepository.findOne(promotionDto.cardImageId);
      if (!cardImage) {
        throw new HttpException('cardImage was not found', 400);
      }
    }

    if (promotionDto.pageImageId) {
      pageImage = await this.imageRepository.findOne(promotionDto.pageImageId);

      if (!pageImage) {
        throw new HttpException('pageImage was not found', 400);
      }
    }

    if (promotionDto.products) {
      products = await this.productRepository.findByIds(promotionDto.products);
    }

    return this.promotionRepository.save({
      ...promotionDto,
      cardImage,
      pageImage,
      products,
      id,
    });
  }

  remove(id: number) {
    return this.promotionRepository.delete(id);
  }
}
