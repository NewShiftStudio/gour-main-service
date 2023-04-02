import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import {
  AbstractAssortment,
  IWarehouseService,
} from './@types/WarehouseService';
import { MoyskladService } from './moysklad.service';
import { AxiosError, AxiosInstance } from 'axios';
import { AssortmentDto } from './dto/assortmentDto';
import { CreateOrderMeta, MoyskladState } from './@types/Moysklad';
import { CreateWarehouseAgentDto } from './dto/create-agent.dto';
import { cutUuidFromMoyskladHref } from './moysklad.helper';

@Injectable()
export class WarehouseService implements IWarehouseService<MoyskladService> {
  constructor(
    public moyskladService: MoyskladService,
    private httpService: HttpService,
  ) {}

  async onModuleInit() {
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

  async getStockOfManyProductByWarehouseIdCityNameAndGram(
      gramByUuids,
      city: CityName
  ) {
    try {
      const modificationsByProducts = await this.moyskladService.getManyModificationByProductIdAndGram(
          gramByUuids
      );

      const store = await this.moyskladService.getStoreByCityName(city);

      if (!store.city) {
        throw new BadRequestException(`Склада в городе ${city} не существует`);
      }

      const stockByModifications = await this.moyskladService.getQuantityByManyAssortmentIdsAndStoreId(
        Object.values(modificationsByProducts),
        store.id
      );

      let result = {};
      for (const [product, modification] of Object.entries(modificationsByProducts)) {
        result[product] = {
          id: String(modification),
          value: stockByModifications[String(modification)] ?? 0
        };
      }

      return result;
    } catch (error) {
      throw new HttpException(
          error?.message || 'Ошибка при получении остатков',
          error?.status || error?.statusCode,
      );
    }
  }

  async getQuantityByAssortmentIds(
      assortmentUuids: Uuid[],
      city: CityName
  ) {
    try {
      const store = await this.moyskladService.getStoreByCityName(city);

      if (!store.city) {
        throw new BadRequestException(`Склада в городе ${city} не существует`);
      }

      const quantityByAssortment = await this.moyskladService.getQuantityByManyAssortmentIdsAndStoreId(
          assortmentUuids,
          store.id
      );

      return quantityByAssortment;
    } catch (error) {
      throw new HttpException(
          error?.message || 'Ошибка при получении остатков',
          error?.status || error?.statusCode,
      );
    }
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
        console.log('PRODUCT ERROR');
        throw new BadRequestException(`Продукта с id ${uuid} не существует`);
      }

      const modification = await this.moyskladService.getModificationByProductIdAndGram(
        product.id,
        gramInString,
      );

      if (!modification) {
        console.log('MOD ERROR');
        throw new BadRequestException(
          `Модификации с id продукта ${product.id} или кол-вом граммов ${gramInString} не существует`,
        );
      }

      const store = await this.moyskladService.getStoreByCityName(city);

      if (!store.city) {
        throw new BadRequestException(`Склада в городе ${city} не существует`);
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

  async getMoyskladOrderStateUuid(uuid: string) {
    const moyskladOrder = await this.moyskladService.getOrder(uuid);

    const orderStateHref = moyskladOrder.state.meta.href;
    const orderStateUuid = cutUuidFromMoyskladHref(orderStateHref);

    return orderStateUuid;
  }

  getMoyskladState(uuid: string) {
    return this.moyskladService.getState(uuid);
  }

  getMoyskladStateByName(name: string) {
    return this.moyskladService.getStateByName(name);
  }

  updateMoyskladOrderState(uuid: string, state: MoyskladState) {
    return this.moyskladService.updateOrderState(uuid, state);
  }

  async createOrder(assortment: AssortmentDto[], meta: CreateOrderMeta) {
    const modifications: AbstractAssortment[] = [];
    for (const ass of assortment) {
      const modification =
        await this.moyskladService.getModificationByProductIdAndGram(
          ass.productId,
          `${ass.gram}гр`,
        );
      modifications.push({ ...ass, id: modification.id });
    }

    return this.moyskladService.createOrder(modifications, meta);
  }

  async createWarehouseAgent(agent: CreateWarehouseAgentDto) {
    return this.moyskladService.createWarehouseAgent(agent);
  }
}
