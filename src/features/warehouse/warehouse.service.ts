import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { IWarehouseService } from './@types/WarehouseService';
import { MoyskladService } from './moysklad.service';
import { AxiosError, AxiosInstance } from 'axios';

@Injectable()
export class WarehouseService implements IWarehouseService<MoyskladService> {
  constructor(
    private moyskladService: MoyskladService,
    private httpService: HttpService,
  ) {}

  onModuleInit() {
    const axios = this.httpService.axiosRef;
    axios.interceptors.response.use(
      (res) => res,
      this.axiosReauth.bind(this, axios),
    );
  }

  async axiosReauth(axios: AxiosInstance, err: AxiosError) {
    const originalRequest = err.config;
    const status = err.response ? err.response.status : null;
    if (
      status === HttpStatus.UNAUTHORIZED &&
      !originalRequest.headers['_retry']
    ) {
      originalRequest.headers['_retry'] = true;
      const token = await this.getAuthorizationToken();
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return axios(originalRequest);
    }
    return err;
  }

  async getAuthorizationToken() {
    const token = await this.moyskladService.getAuthorizationToken({
      login: process.env.WAREHOUSE_LOGIN,
      password: process.env.WAREHOUSE_PASSWORD,
    });

    return token;
  }

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

      if (!modification) {
        throw new BadRequestException(
          `Модификации с id продукта ${product.id} или кол-вом граммов ${gramInString} не существует`,
        );
      }

      const store = await this.moyskladService.getStoreByCityName(city);

      if (!store) {
        throw new BadRequestException(
          `Склада с в городе ${city} не существует`,
        );
      }

      const stock = await this.moyskladService.getStockByAssortmentIdAndStoreId(
        modification.id,
        store.id,
      );

      return stock;
    } catch (error) {
      throw new HttpException(
        error?.message || 'Ошибка при получении остатков',
        error?.status || error?.statusCode,
      );
    }
  }
}
