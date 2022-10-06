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
  ) {}

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

  // TODO: добавить метод удаления скидок
}
