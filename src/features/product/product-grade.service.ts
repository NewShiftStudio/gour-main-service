import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Not, Repository } from 'typeorm';
import { ProductGrade } from '../../entity/ProductGrade';
import { getPaginationOptions } from '../../common/helpers/controllerHelpers';
import { ProductGradeCreateDto } from './dto/product-grade.create.dto';
import { BaseGetListDto } from '../../common/dto/BaseGetListDto';
import { Product } from '../../entity/Product';
import { ProductGradeGetListDto } from './dto/product-grade.get-list.dto';

@Injectable()
export class ProductGradeService {
  constructor(
    @InjectRepository(ProductGrade)
    private productGradeRepository: Repository<ProductGrade>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  findFromProduct(productId: number, params: ProductGradeGetListDto) {
    const where: FindOneOptions<ProductGrade>['where'] = {
      productId,
      isApproved: true,
    };
    if (params.onlyWithComments) {
      where.comment = Not('');
    }
    return this.productGradeRepository.find({
      ...getPaginationOptions(params.offset, params.length),
      where,
    });
  }

  findMany(params: ProductGradeGetListDto) {
    const where: FindOneOptions<ProductGrade>['where'] = {};
    if (params.onlyWithComments) {
      where.comment = Not('');
    }
    if (params.isApproved !== undefined) {
      where.isApproved = params.isApproved;
    }
    return this.productGradeRepository.find({
      ...getPaginationOptions(params.offset, params.length),
      where,
    });
  }

  getOne(id: number) {
    return this.productGradeRepository.findOne({ id });
  }

  async create(productId: number, productGrade: ProductGradeCreateDto) {
    return this.productGradeRepository.save({
      ...productGrade,
      isApproved: !productGrade.comment,
      productId,
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
