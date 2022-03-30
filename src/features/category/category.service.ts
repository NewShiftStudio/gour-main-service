import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { Category } from '../../entity/Category';
import { getPaginationOptions } from '../../common/helpers/controllerHelpers';
import { BaseGetListDto } from '../../common/dto/BaseGetListDto';
import { CategoryCreateDto } from './dto/category.create.dto';
import { CategoryUpdateDto } from './dto/category.update.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  findMany(params: BaseGetListDto) {
    const options: FindManyOptions<Category> = {
      ...getPaginationOptions(params.offset, params.length),
    };

    return this.categoryRepository.find(options);
  }

  getOne(id: number) {
    return this.categoryRepository.findOne({ id });
  }

  create(category: CategoryCreateDto) {
    return this.categoryRepository.save(category);
  }

  update(id: number, category: CategoryUpdateDto) {
    return this.categoryRepository.save({
      ...category,
      id,
    });
  }

  remove(id: number) {
    return this.categoryRepository.delete(id);
  }
}
