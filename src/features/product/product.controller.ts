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
import { ProductGradeCreateDto } from './dto/product-grade.create.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductUpdateDto } from './dto/product.update.dto';
import { TOTAL_COUNT_HEADER } from '../../constants/httpConstants';
import { Response } from 'express';
import { ProductGradeGetListDto } from './dto/product-grade.get-list.dto';
import { ProductGradeUpdateDto } from './dto/product-grade.update.dto';
import { ProductWithMetricsDto } from './dto/product-with-metrics.dto';

@ApiTags('products')
@Controller()
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly productGradeService: ProductGradeService,
  ) {}

  @Get('/products')
  async getAll(@Query() params: ProductGetListDto, @Res() res: Response) {
    const [products, count] = await this.productService.findMany(params);

    res.set(TOTAL_COUNT_HEADER, count.toString());
    return res.send(products);
  }

  @Get('/products/novelties')
  getNovelties(@Query() params: ProductGetListDto) {
    return this.productService.findNovelties(params);
  }

  @ApiResponse({
    type: ProductWithMetricsDto,
  })
  @Get('/products/:id')
  getOne(@Param('id') id: string, @Query() params: ProductGetOneDto = {}) {
    return this.productService.getOne(+id, params);
  }

  @Post('/products')
  async post(@Body() product: ProductCreateDto) {
    return this.productService.create(product);
  }

  @Put('/products/:id')
  put(@Param('id') id: string, @Body() product: ProductUpdateDto) {
    return this.productService.update(+id, product);
  }

  @Delete('/products/:id')
  remove(@Param('id') id: string, @Query('hard') hard: boolean) {
    return this.productService.remove(+id, !!hard);
  }

  @Get('/products/:productId/grades')
  getProductGrades(
    @Param('productId') productId: string,
    @Query() params: ProductGradeGetListDto,
  ) {
    return this.productGradeService.findFromProduct(+productId, params);
  }

  @Post('/products/:productId/grades')
  createProductGrades(
    @Param('productId') productId: string,
    @Body() grade: ProductGradeCreateDto,
  ) {
    return this.productGradeService.create(+productId, grade);
  }

  @Get('/productGrades')
  getGrades(@Query() params: ProductGradeGetListDto) {
    return this.productGradeService.findMany(params);
  }

  @Put('/productGrades/:gradeId')
  updateGrade(
    @Param('gradeId') gradeId: string,
    @Body() dto: ProductGradeUpdateDto,
  ) {
    return this.productGradeService.update(+gradeId, dto);
  }
}
