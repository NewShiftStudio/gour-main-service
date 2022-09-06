import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from '../../entity/Product';
import { Category } from '../../entity/Category';
import { RoleDiscount } from '../../entity/RoleDiscount';
import { ProductGrade } from '../../entity/ProductGrade';
import { ProductGradeService } from './product-grade.service';
import { ClientRole } from '../../entity/ClientRole';
import { Image } from '../../entity/Image';
import { Promotion } from '../../entity/Promotion';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Category,
      RoleDiscount,
      ProductGrade,
      ClientRole,
      Image,
      Promotion,
    ]),
  ],
  providers: [ProductService, ProductGradeService],
  controllers: [ProductController],
  exports: [ProductService, ProductGradeService],
})
export class ProductModule {}
