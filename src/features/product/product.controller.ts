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
  Res,
} from '@nestjs/common';
import { ProductGetListDto } from './dto/product.get-list.dto';
import { ProductCreateDto } from './dto/product.create.dto';
import { ProductService } from './product.service';
import { ProductGetOneDto } from './dto/product.get-one.dto';
import { ProductGradeService } from './product-grade.service';
import { BaseGetListDto } from '../../common/dto/BaseGetListDto';
import { ProductGradeCreateDto } from './dto/product-grade.create.dto';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ProductUpdateDto } from './dto/product.update.dto';
import { TOTAL_COUNT_HEADER } from '../../constants/httpConstants';
import { Response } from 'express';
import { ProductGradeGetListDto } from './dto/product-grade.get-list.dto';

@ApiTags('products')
@Controller()
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly productGradeService: ProductGradeService,
  ) {}

  @Get('/products')
  async getAll(@Query() params: ProductGetListDto, @Res() res: Response) {
    const [clients, count] = await this.productService.findMany(params);

    res.set(TOTAL_COUNT_HEADER, count.toString());
    return res.send(clients);
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
    @Query() params: ProductGradeGetListDto,
  ) {
    return this.productGradeService.findFromProduct(productId, params);
  }

  @Post('/products/:productId/grades')
  createProductGrades(
    @Param('productId') productId: number,
    @Body() grade: ProductGradeCreateDto,
  ) {
    return this.productGradeService.create(productId, grade);
  }

  @Get('/productGrades')
  getGrades(@Query() params: ProductGradeGetListDto) {
    return this.productGradeService.findMany(params);
  }

  @Post('/productGrades/:gradeId/approve')
  updateGrade(@Param('gradeId') gradeId: number) {
    return this.productGradeService.update(gradeId, {
      isApproved: true,
    });
  }
}
