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
import { CategoryService } from './category.service';
import { BaseGetListDto } from '../../common/dto/BaseGetListDto';
import { CategoryCreateDto } from './dto/category.create.dto';
import { CategoryUpdateDto } from './dto/category.update.dto';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { TOTAL_COUNT_HEADER } from '../../constants/httpConstants';

@ApiTags('categories')
@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/categories')
  async getAll(@Query() params: BaseGetListDto, @Res() res: Response) {
    const [clients, count] = await this.categoryService.findMany(params);

    res.set(TOTAL_COUNT_HEADER, count.toString());
    return res.send(clients);
  }

  @Get('/categories/:id')
  getOne(@Param('id') id: number) {
    return this.categoryService.getOne(id);
  }

  @Post('/categories')
  post(@Body() category: CategoryCreateDto) {
    return this.categoryService.create(category);
  }

  @Put('/categories/:id')
  put(@Param('id') id: number, @Body() category: CategoryUpdateDto) {
    return this.categoryService.update(id, category);
  }

  @Delete('/categories/:id')
  remove(@Param('id') id: number) {
    return this.categoryService.remove(id);
  }
}
