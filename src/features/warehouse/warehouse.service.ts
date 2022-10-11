import { BadRequestException, Injectable } from '@nestjs/common';
import { IWarehouseService } from './@types/WarehouseService';
import { MoyskladService } from './moysklad.service';

@Injectable()
export class WarehouseService implements IWarehouseService<MoyskladService> {
  constructor(private moyskladService: MoyskladService) {}

  async getStockOfProductByWarehouseIdCityNameAndGram(
    uuid: Uuid,
    city: CityName,
    gram: number,
  ) {
    try {
      const gramInString = `${gram}гр`;
      const product = await this.moyskladService.getProductById(uuid);

      if (!product) {
        throw new BadRequestException(`Продукта с id ${uuid} не существует`);
      }

      const modification =
        await this.moyskladService.getModificationByProductIdAndGram(
          product.id,
          gramInString,
        );

      if (!modification.id) {
        throw new BadRequestException(
          `Модификации с id ${modification.id} не существует`,
        );
      }

      const store = await this.moyskladService.getStoreByCityName(city);

      if (!store) {
        throw new BadRequestException(`Склада с id ${store.id} не существует`);
      }

      const stock = await this.moyskladService.getStockByAssortmentIdAndStoreId(
        modification.id,
        store.id,
      );

      return stock;
    } catch (error) {
      throw new BadRequestException(
        error?.message || 'Ошибка при получении остатков',
        error,
      );
    }
  }
}
