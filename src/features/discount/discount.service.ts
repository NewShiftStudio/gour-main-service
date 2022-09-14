import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Discount } from 'src/entity/Discount';
import { Client } from 'src/entity/Client';
import { Category } from 'src/entity/Category';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(Discount)
    private discountRepository: Repository<Discount>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  findByClient(client: Client) {
    // FIXME: мб тогда вынести в модуль с категориями?
    return this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.title', 'title')
      .leftJoinAndSelect('category.parentCategories', 'parentCategories')
      .leftJoinAndSelect('category.discounts', 'discounts')
      .leftJoinAndSelect('discounts.client', 'client')
      .where('discounts.client.id = :id', { id: client.id })
      .getMany();

    // return this.discountRepository.find({
    //   where: { client },
    //   relations: ['productCategory', 'productCategory.parentCategories'],
    //   order: {
    //     productCategory: 'ASC',
    //   },
    // });
  }

  findOneByFK(client: Client, category: Category) {
    return this.discountRepository.findOne({
      client,
      productCategory: category,
    });
  }

  async add(client: Client, category: Category, price: number) {
    const candidateDiscount = await this.findOneByFK(client, category);

    if (candidateDiscount) {
      return this.discountRepository.save({
        ...candidateDiscount,
        price: candidateDiscount.price + price,
      });
    }

    return this.discountRepository.save({
      client,
      productCategory: category,
      price,
    });
  }
}
