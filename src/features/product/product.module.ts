import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product } from 'src/entity/Product';
import { Category } from 'src/entity/Category';
import { RoleDiscount } from 'src/entity/RoleDiscount';
import { ProductGrade } from 'src/entity/ProductGrade';
import { ClientRole } from 'src/entity/ClientRole';
import { Image } from 'src/entity/Image';
import { Promotion } from 'src/entity/Promotion';
import { Client } from 'src/entity/Client'; // [ВЛАЖНЫЕ МЕЧТЫ]: эх, щас бы barrel exports юзать...

import { CategoryModule } from '../category/category.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductGradeService } from './product-grade.service';

@Module({
  imports: [
    CategoryModule,
    TypeOrmModule.forFeature([
      Product,
      Category,
      RoleDiscount,
      ProductGrade,
      ClientRole,
      Image,
      Promotion,
      Client,
    ]),
  ],
  providers: [ProductService, ProductGradeService],
  controllers: [ProductController],
  exports: [ProductService, ProductGradeService],
})
export class ProductModule {}
