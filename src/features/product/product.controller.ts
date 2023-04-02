import { Controller,Post } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

import { Client } from '../../entity/Client';
import { ProductGetListDto } from './dto/product-get-list.dto';
import { ProductCreateDto } from './dto/product-create.dto';
import { ProductService } from './product.service';
import { ProductGetOneDto } from './dto/product-get-one.dto';
import { ProductGradeService } from './product-grade.service';
import { ProductGradeCreateDto } from './dto/product-grade-create.dto';
import { ProductUpdateDto } from './dto/product-update.dto';
import { ProductGradeGetListDto } from './dto/product-grade-get-list.dto';
import { ProductGradeUpdateDto } from './dto/product-grade-update.dto';
import { ProductGetSimilarDto } from './dto/product-get-similar.dto';
import { ExportDto } from 'src/common/dto/export.dto';
import {UpdateMoyskladEntityDto} from "../order/dto/update-moysklad-entity.dto";
import {ok} from "assert";

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly productGradeService: ProductGradeService,
  ) {}

  @MessagePattern('get-products')
  getAll(
    @Payload('params') params: ProductGetListDto,
    @Payload('dto') dto: ExportDto,
    @Payload('client') client: Client,
  ) {
    return this.productService.findMany(params, client, dto);
  }

  @MessagePattern('get-novelties')
  getNovelties(
    @Payload('params') params: ProductGetListDto,
    @Payload('client') client: Client,
  ) {
    return this.productService.findNovelties(params, client);
  }

  @MessagePattern('webhook-update')
  async updateWebhook(@Payload() dto: UpdateMoyskladEntityDto) {
    const parsedDto: UpdateMoyskladEntityDto = JSON.parse(JSON.stringify(dto));
    console.log('RECEIVED PRODUCT UPDATE WEBHOOK', parsedDto);
    const updateEvent = parsedDto.events[0];
    const shouldContinue =  updateEvent.updatedFields && updateEvent.updatedFields.includes('weighed');
    if (!shouldContinue) {
      return 'Чекбокс веса не изменён, пропускаем';
    }

    const splitEventMeta = updateEvent.meta.href.split('/');
    const productUuid = splitEventMeta[splitEventMeta.length - 1];

    return this.productService.updateProductIsWeighed(productUuid);
  }

  @MessagePattern('get-product-similar')
  getSimilarProducts(
    @Payload('params') params: ProductGetSimilarDto,
    @Payload('client') client: Client,
  ) {
    return this.productService.getSimilar(params, client);
  }

  @MessagePattern('get-product')
  getOne(
    @Payload('id') id: number,
    @Payload('params') params: ProductGetOneDto = {},
    @Payload('client') client: Client,
  ) {
    return this.productService.getOne(id, params, client);
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
    @Payload('productId') productId: number,
    @Payload('dto') dto: ProductGradeCreateDto,
    @Payload('clientId') clientId: string,
  ) {
    return this.productGradeService.create(productId, dto, clientId);
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
