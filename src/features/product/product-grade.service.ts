import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductGrade } from '../../entity/ProductGrade';
import { getPaginationOptions } from '../../common/helpers/controllerHelpers';
import { ProductGradeCreateDto } from './dto/product-grade.create.dto';
import { BaseGetListDto } from '../../common/dto/BaseGetListDto';
import { Product } from '../../entity/Product';

@Injectable()
export class ProductGradeService {
  constructor(
    @InjectRepository(ProductGrade)
    private productGradeRepository: Repository<ProductGrade>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  findFromProduct(productId: number, params: BaseGetListDto) {
    return this.productGradeRepository.find({
      ...getPaginationOptions(params.offset, params.length),
      where: {
        productId,
      },
    });
  }

  findMany(params: BaseGetListDto) {
    return this.productGradeRepository.find({
      ...getPaginationOptions(params.offset, params.length),
    });
  }

  getOne(id: number) {
    return this.productGradeRepository.findOne({ id });
  }

  async create(productGrade: ProductGradeCreateDto) {
    return this.productGradeRepository.save({
      ...productGrade,
      product: await this.productRepository.findOne(productGrade.product),
    });
  }

  update(id: number, productGrade: Partial<ProductGrade>) {
    return this.productGradeRepository.save({
      ...productGrade,
      id,
    });
  }

  remove(id: number) {
    return this.productGradeRepository.delete(id);
  }
}
