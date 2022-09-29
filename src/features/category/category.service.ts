import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindManyOptions, In, Repository } from 'typeorm';

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

  async findMany(params: BaseGetListDto) {
    const options: FindManyOptions<Category> = {
      ...getPaginationOptions(params.offset, params.length),
    };

    return this.categoryRepository
      .createQueryBuilder('top_categories')
      .leftJoinAndSelect('top_categories.parentCategories', 'top_parent')
      .leftJoinAndSelect('top_categories.subCategories', 'mid_categories')
      .leftJoinAndSelect('mid_categories.subCategories', 'bot_categories')

      .leftJoinAndSelect('top_categories.title', 'top_title')
      .leftJoinAndSelect('mid_categories.title', 'mid_title')
      .leftJoinAndSelect('bot_categories.title', 'bot_title')

      .where('top_parent.id IS NULL')
      .skip(options.skip)
      .take(options.take)
      .getManyAndCount();
  }

  async findCommon(params: BaseGetListDto) {
    const options: FindManyOptions<Category> = {
      ...getPaginationOptions(params.offset, params.length),
    };

    const parentCategoriesLength = await this.categoryRepository
      .createQueryBuilder('top_categories')
      .leftJoinAndSelect('top_categories.parentCategories', 'parent')
      .where('parent.id IS NULL')
      .getCount();

    const midCategories = await this.categoryRepository
      .createQueryBuilder('mid_categories')
      .leftJoinAndSelect('mid_categories.parentCategories', 'top_categories')
      .leftJoinAndSelect('mid_categories.subCategories', 'bot_categories')
      .leftJoinAndSelect('mid_categories.title', 'mid_title')
      .where('top_categories.id IS NOT NULL')
      .where('bot_categories.id IS NOT NULL')
      .getMany();

    const commonMidCategories = midCategories.filter(
      (category) => category.parentCategories.length === parentCategoriesLength,
    );

    return commonMidCategories;
  }

  async getOne(id: number) {
    try {
      return await this.categoryRepository.findOneOrFail({ id });
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

    if (dto.parentCategoriesIds) {
      category.parentCategories = [];
      for (const parentCategoryId of dto.parentCategoriesIds) {
        const parentCategory = await this.getOne(parentCategoryId);
        category.parentCategories.push(parentCategory);
      }
    }

    return this.categoryRepository.save(category);
  }

  async update(id: number, dto: CategoryUpdateDto) {
    const _isExist = await this.getOne(id);

    const category: DeepPartial<Category> = { title: dto.title };

    if (dto.subCategoriesIds) {
      category.subCategories = [];
      for (const subCategoryId of dto.subCategoriesIds) {
        const subCategory = await this.getOne(subCategoryId);
        category.subCategories.push(subCategory);
      }
    }

    if (dto.parentCategoriesIds) {
      category.parentCategories = [];
      for (const parentCategoryId of dto.parentCategoriesIds) {
        const parentCategory = await this.getOne(parentCategoryId);
        category.parentCategories.push(parentCategory);
      }
    }

    return this.categoryRepository.save({
      ...category,
      id,
    });
  }

  async remove(id: number) {
    const categories = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoin('category.parentCategories', 'midCategories')
      .leftJoin('midCategories.parentCategories', 'topCategories')
      .where('category.id = :id', { id: id })
      .orWhere('midCategories.id = :id', { id })
      .orWhere('topCategories.id = :id', { id: id })
      .getMany();

    const categoriesIds = categories.map((i) => i.id);
    if (categoriesIds.length) {
      return await this.categoryRepository.delete(categoriesIds); // через 1 запрос не удаляются
    }
    throw new NotFoundException('Нет подходящих категорий');
  }
}
