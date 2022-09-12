import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindManyOptions, IsNull, Repository } from 'typeorm';
import { Category } from '../../entity/Category';
import { getPaginationOptions } from '../../common/helpers/controllerHelpers';
import { BaseGetListDto } from '../../common/dto/base-get-list.dto';
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

    return this.categoryRepository.findAndCount({
      ...options,
      relations: [
        'subCategories',
        'subCategories.subCategories',
        'parentCategories',
      ],
      where: { parentCategories: IsNull() }, // FIXME: не доставать категории с верхнеуровневыми деревьями
    });
  }

  getOne(id: number) {
    try {
      return this.categoryRepository.findOne({ id });
    } catch {
      throw new NotFoundException('Категория не найдена');
    }
  }

  async create(dto: CategoryCreateDto) {
    const category: DeepPartial<Category> = { title: dto.title };

    if (dto.subCategoriesIds) {
      category.subCategories = [];
      for (const subCategoryId of dto.subCategoriesIds) {
        const subCategory = await this.getOne(subCategoryId);
        category.subCategories.push(subCategory);
      }
    }

    return this.categoryRepository.save(category);
  }

  async update(id: number, dto: CategoryUpdateDto) {
    const category: DeepPartial<Category> = { title: dto.title };

    if (dto.subCategoriesIds) {
      category.subCategories = [];
      for (const subCategoryId of dto.subCategoriesIds) {
        const subCategory = await this.getOne(subCategoryId);
        category.subCategories.push(subCategory);
      }
    }

    return this.categoryRepository.save({
      ...category,
      id,
    });
  }

  remove(id: number) {
    return this.categoryRepository.delete(id);
  }
}
