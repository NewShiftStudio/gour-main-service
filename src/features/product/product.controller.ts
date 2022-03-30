import { Product } from '../../entity/Product';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProductGetListDto } from './dto/product.get-list.dto';
import { ProductCreateDto } from './dto/product.create.dto';
import { ProductService } from './product.service';
import { ProductGetOneDto } from './dto/product.get-one.dto';
import { ProductGradeService } from './product-grade.service';
import { BaseGetListDto } from '../../common/dto/BaseGetListDto';
import { ProductGradeCreateDto } from './dto/product-grade.create.dto';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import {ProductUpdateDto} from "./dto/product.update.dto";

@ApiTags('products')
@Controller()
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly productGradeService: ProductGradeService,
  ) {}

  @Get('/products')
  getAll(@Query() params: ProductGetListDto) {
    return this.productService.findMany(params);
  }

  @Get('/products/novelties')
  getNovelties(@Query() params: ProductGetListDto) {
    return this.productService.findNovelties();
  }

  @Get('/products/:id')
  getOne(@Param('id') id: number, @Query() params: ProductGetOneDto = {}) {
    return this.productService.getOne(id, params);
  }

  @Post('/products')
  async post(@Body() product: ProductCreateDto) {
    return this.productService.create(product);
  }

  @Put('/products/:id')
  put(@Param('id') id: number, @Body() product: ProductUpdateDto) {
    return this.productService.update(id, product);
  }

  @Delete('/products/:id')
  remove(@Param('id') id: number, @Query('hard') hard: boolean) {
    return this.productService.remove(id, !!hard);
  }

  @Get('/products/:productId/grades')
  getProductGrades(
    @Param('productId') productId: number,
    @Query() params: BaseGetListDto,
  ) {
    return this.productGradeService.findFromProduct(productId, params);
  }

  @Post('/products/:productId/grades')
  createProductGrades(
    @Param('productId') productId: number,
    @Body() grade: ProductGradeCreateDto,
  ) {
    return this.productGradeService.create(grade);
  }

  @Get('/productGrades')
  getGrades(@Query() params: BaseGetListDto) {
    return this.productGradeService.findMany(params);
  }
}
