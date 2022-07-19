import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

import { ProductGetListDto } from './dto/product-get-list.dto';
import { ProductCreateDto } from './dto/product-create.dto';
import { ProductService } from './product.service';
import { ProductGetOneDto } from './dto/product-get-one.dto';
import { ProductGradeService } from './product-grade.service';
import { ProductGradeCreateDto } from './dto/product-grade-create.dto';
import { ProductUpdateDto } from './dto/product-update.dto';
import { ProductGradeGetListDto } from './dto/product-grade-get-list.dto';
import { ProductGradeUpdateDto } from './dto/product-grade-update.dto';

@ApiTags('products')
@Controller()
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly productGradeService: ProductGradeService,
  ) {}

  @MessagePattern('get-products')
  getAll(@Payload() params: ProductGetListDto) {
    return this.productService.findMany(params);
  }

  @MessagePattern('get-novelties')
  getNovelties(@Payload() params: ProductGetListDto) {
    return this.productService.findNovelties(params);
  }

  @MessagePattern('get-product')
  getOne(
    @Payload('id') id: number,
    @Payload('params') params: ProductGetOneDto = {},
  ) {
    return this.productService.getOne(id, params);
  }

  @MessagePattern('create-product')
  post(@Payload() dto: ProductCreateDto) {
    return this.productService.create(dto);
  }

  @MessagePattern('edit-product')
  put(@Payload('id') id: number, @Payload('dto') dto: ProductUpdateDto) {
    return this.productService.update(id, dto);
  }

  @MessagePattern('delete-product')
  remove(@Payload('id') id: number, @Payload('hard') hard: boolean) {
    return this.productService.remove(id, hard);
  }

  @MessagePattern('get-product-grades')
  getProductGrades(
    @Payload('id') id: number,
    @Payload('params') params: ProductGradeGetListDto,
  ) {
    return this.productGradeService.findFromProduct(id, params);
  }

  @MessagePattern('create-product-grade')
  createProductGrades(
    @Payload('id') id: number,
    @Payload('dto') dto: ProductGradeCreateDto,
  ) {
    return this.productGradeService.create(id, dto);
  }

  @MessagePattern('get-grades')
  getGrades(@Payload() params: ProductGradeGetListDto) {
    return this.productGradeService.findMany(params);
  }

  @MessagePattern('edit-grade')
  updateGrade(
    @Payload('id') id: number,
    @Payload('dto') dto: ProductGradeUpdateDto,
  ) {
    return this.productGradeService.update(id, dto);
  }
}
