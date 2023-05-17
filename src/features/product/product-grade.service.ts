import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Not, Repository } from 'typeorm';

import { ProductGrade } from '../../entity/ProductGrade';
import { Product } from '../../entity/Product';
import { getPaginationOptions } from '../../common/helpers/controllerHelpers';
import { ProductGradeCreateDto } from './dto/product-grade-create.dto';
import { ProductGradeGetListDto } from './dto/product-grade-get-list.dto';
import { ProductService } from './product.service';
import { ClientService } from '../client/client.service';

@Injectable()
export class ProductGradeService {
  constructor(
    @InjectRepository(ProductGrade)
    private productGradeRepository: Repository<ProductGrade>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    private productService: ProductService,
    private clientService: ClientService,
  ) {}

  findFromProduct(productId: number, params: ProductGradeGetListDto) {
    const where: FindOneOptions<ProductGrade>['where'] = {
      product: { id: productId },
    };
    if (params.withComments) {
      where.comment = Not('');
    }
    if (params.isApproved !== undefined) {
      where.isApproved = params.isApproved === 'true';
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
      order: {
        'createdAt': 'DESC',
      },
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
    productId: number,
    dto: ProductGradeCreateDto,
    clientId: string,
  ) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    const client = await this.clientService.findOne(clientId);

    const grade = await this.productGradeRepository.save({
      ...dto,
      isApproved: dto.comment ? null : true,
      product,
      client,
    });

    const allProductGrades = await this.productGradeRepository.find({
      product: { id: productId },
      isApproved: true,
    });

    const newProductGrade =
      Math.round(
        (allProductGrades.reduce((acc, it) => acc + it.value, 0) /
          allProductGrades.length) *
          10,
      ) / 10;

    await this.productRepository.update(productId, {
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
