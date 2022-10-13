import { Repository } from 'typeorm';

import { Category } from 'src/entity/Category';

const MINIMUM_DISCOUNT = 0;

const categoryQueryBuilder = {
  findCategoryWithDiscounts: (
    repository: Repository<Category>,
    clientId: number,
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
};

export default categoryQueryBuilder;
