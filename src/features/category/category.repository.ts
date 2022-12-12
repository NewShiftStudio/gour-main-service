import { FindManyOptions, Repository } from 'typeorm';

import { Category } from 'src/entity/Category';

const MINIMUM_DISCOUNT = 0;

const categoryQueryBuilder = {
  findCategoryWithDiscounts: (
    repository: Repository<Category>,
    clientId: string,
  ) =>
    repository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.title', 'categoryTitle')
      .leftJoinAndSelect('category.subCategories', 'subCategories')
      .leftJoinAndSelect('subCategories.title', 'subCategoriesTitle')
      .leftJoinAndSelect('subCategories.discounts', 'discounts')
      .leftJoin('discounts.client', 'client')

      .where('client.id = :id', { id: clientId })
      .andWhere('discounts.price > :discount', { discount: MINIMUM_DISCOUNT })
      .andWhere('category.hasDiscount = true')
      .select([
        'category.id',
        'categoryTitle.ru',
        'categoryTitle.en',
        'subCategories.id',
        'subCategoriesTitle.ru',
        'subCategoriesTitle.en',
        'discounts.price',
      ])
      .getMany(),

  findAllCategories: (
    repository: Repository<Category>,
    options: FindManyOptions<Category>,
  ) =>
    repository
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
      .getManyAndCount(),
};

export default categoryQueryBuilder;
