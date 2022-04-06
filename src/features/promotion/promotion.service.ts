import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promotion } from '../../entity/Promotion';
import { getPaginationOptions } from '../../common/helpers/controllerHelpers';
import { PromotionCreateDto } from './dto/promotion.create.dto';
import {PromotionUpdateDto} from "./dto/promotion.update.dto";
import {BaseGetListDto} from "../../common/dto/BaseGetListDto";

@Injectable()
export class PromotionService {
  constructor(
    @InjectRepository(Promotion)
    private promotionRepository: Repository<Promotion>,
  ) {}

  findMany(params: BaseGetListDto) {
    return this.promotionRepository.findAndCount({
      ...getPaginationOptions(params.offset, params.length),
    });
  }

  getOne(id: number) {
    return this.promotionRepository.findOne({ id });
  }

  async create(promotionDto: PromotionCreateDto) {
    return this.promotionRepository.save({
      ...promotionDto,
      products: await this.promotionRepository.findByIds(promotionDto.products),
    });
  }

  async update(id: number, promotionDto: PromotionUpdateDto) {
    return this.promotionRepository.save({
      ...promotionDto,
      products: await this.promotionRepository.findByIds(promotionDto.products),
    });
  }

  remove(id: number) {
    return this.promotionRepository.delete(id);
  }
}
