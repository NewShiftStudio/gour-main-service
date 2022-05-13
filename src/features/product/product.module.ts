import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../../entity/Product';
import { Category } from '../../entity/Category';
import { RoleDiscount } from '../../entity/RoleDiscount';
import { ProductGrade } from '../../entity/ProductGrade';
import { ProductGradeService } from './product-grade.service';
import { ClientRole } from '../../entity/ClientRole';
import { Image } from '../../entity/Image';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Category,
      RoleDiscount,
      ProductGrade,
      ClientRole,
      Image,
    ]),
  ],
  providers: [ProductService, ProductGradeService],
  controllers: [ProductController],
  exports: [ProductService, ProductGradeService],
})
export class ProductModule {}
