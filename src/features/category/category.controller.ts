import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

import { Client } from 'src/entity/Client';
import { CategoryService } from './category.service';
import { BaseGetListDto } from '../../common/dto/base-get-list.dto';
import { CategoryCreateDto } from './dto/category.create.dto';
import { CategoryUpdateDto } from './dto/category.update.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @MessagePattern('get-categories')
  getAll(@Payload() params: BaseGetListDto) {
    return this.categoryService.findMany(params);
  }

  @MessagePattern('get-category')
  getOne(@Payload() id: number) {
    return this.categoryService.getOneOrFail(id);
  }

  @MessagePattern('get-categories-with-discount')
  getCategoriesWithDiscounts(@Payload('client') client: Client) {
    return this.categoryService.findCategoriesWithDiscounts(client);
  }

  @MessagePattern('create-category')
  async post(@Payload() dto: CategoryCreateDto) {
    return this.categoryService.create(dto);
  }

  @MessagePattern('edit-category')
  put(@Payload('id') id: number, @Payload('dto') dto: CategoryUpdateDto) {
    return this.categoryService.update(id, dto);
  }

  @MessagePattern('delete-category')
  remove(@Payload() id: number) {
    return this.categoryService.remove(id);
  }
}
