import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindManyOptions, Repository } from 'typeorm';

import { Client } from 'src/entity/Client';
import { Category } from '../../entity/Category';
import { getPaginationOptions } from '../../common/helpers/controllerHelpers';
import { BaseGetListDto } from '../../common/dto/base-get-list.dto';
import { CategoryCreateDto } from './dto/category.create.dto';
import { CategoryUpdateDto } from './dto/category.update.dto';
import categoryQueryBuilder from './category.repository';
import { getUniqueCategoriesWithDiscounts } from './category.helpers';

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

  async findCategoriesWithDiscounts(client: Client) {
    const categoriesList = await categoryQueryBuilder.findCategoryWithDiscounts(
      this.categoryRepository,
      client.id,
    );

    return getUniqueCategoriesWithDiscounts(categoriesList);
  }

  async getOneOrFail(id: number) {
    try {
      return await this.categoryRepository.findOneOrFail({ id });
    } catch {
      throw new NotFoundException('Категория не найдена');
    }
  }

  async create(dto: CategoryCreateDto) {
    const category: DeepPartial<Category> = {
      title: dto.title,
      hasDiscount: dto.hasDiscount || false,
    };

    if (dto.subCategoriesIds) {
      category.subCategories = [];
      for (const subCategoryId of dto.subCategoriesIds) {
        const subCategory = await this.getOneOrFail(subCategoryId);
        category.subCategories.push(subCategory);
      }
    }

    if (dto.parentCategoriesIds) {
      category.parentCategories = [];
      for (const parentCategoryId of dto.parentCategoriesIds) {
        const parentCategory = await this.getOneOrFail(parentCategoryId);
        category.parentCategories.push(parentCategory);
      }
    }

    return this.categoryRepository.save(category);
  }

  async update(id: number, dto: CategoryUpdateDto) {
    const categoryById = await this.getOneOrFail(id);

    const category: DeepPartial<Category> = {
      title: dto.title,
      hasDiscount: dto.hasDiscount ?? categoryById.hasDiscount,
    };

    if (dto.subCategoriesIds) {
      category.subCategories = [];
      for (const subCategoryId of dto.subCategoriesIds) {
        const subCategory = await this.getOneOrFail(subCategoryId);
        category.subCategories.push(subCategory);
      }
    }

    if (dto.parentCategoriesIds) {
      category.parentCategories = [];
      for (const parentCategoryId of dto.parentCategoriesIds) {
        const parentCategory = await this.getOneOrFail(parentCategoryId);
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
