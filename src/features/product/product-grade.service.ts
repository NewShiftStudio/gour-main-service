import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Not, Repository } from 'typeorm';

import { ProductGrade } from '../../entity/ProductGrade';
import { getPaginationOptions } from '../../common/helpers/controllerHelpers';
import { ProductGradeCreateDto } from './dto/product-grade-create.dto';
import { Product } from '../../entity/Product';
import { ProductGradeGetListDto } from './dto/product-grade-get-list.dto';
import { Client } from 'src/entity/Client';

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
    };
    if (params.withComments) {
      where.comment = Not('');
    }
    return this.productGradeRepository.find({
      ...getPaginationOptions(params.offset, params.length),
      where,
      relations: ['product', 'client'],
    });
  }

  findMany(params: ProductGradeGetListDto) {
    const where: FindOneOptions<ProductGrade>['where'] = {};
    if (params.withComments) {
      where.comment = params.withComments === 'true' ? Not('') : '';
    }
    if (params.isApproved !== undefined) {
      where.isApproved = params.isApproved === 'true';
    }
    if (params.waitConfirmation) {
      where.isApproved = params.waitConfirmation === 'true' ? null : Not(null);
    }
    return this.productGradeRepository.find({
      ...getPaginationOptions(params.offset, params.length),
      where,
      relations: ['product', 'client'],
    });
  }

  getOne(id: number) {
    return this.productGradeRepository.findOne(
      { id },
      {
        relations: ['product', 'client'],
      },
    );
  }

  async create(
    id: number,
    productGrade: ProductGradeCreateDto,
    client: Client,
  ) {
    const product = await this.productRepository.findOne(id);

    if (!product) throw new NotFoundException('Товар не найден');

    const gradeCandidate =
      (await this.productGradeRepository.findOne({
        client,
        product,
      })) || {};

    const grade = await this.productGradeRepository.save({
      ...gradeCandidate,
      ...productGrade,
      isApproved: productGrade.comment ? null : true,
      product,
      client,
    });

    const allProductGrades = await this.productGradeRepository.find({
      product: { id },
      isApproved: true,
    });

    const newProductGrade =
      Math.round(
        (allProductGrades.reduce((acc, it) => acc + it.value, 0) /
          allProductGrades.length) *
          10,
      ) / 10;

    await this.productRepository.update(id, {
      grade: newProductGrade,
    });

    return grade;
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
