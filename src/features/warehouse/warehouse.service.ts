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
import { ModificationDto } from './dto/modification.dto';
import { CreateOrderMeta, MoyskladState } from './@types/Moysklad';
import { CreateWarehouseAgentDto } from './dto/create-agent.dto';
import { cutUuidFromMoyskladHref } from './moysklad.helper';

@Injectable()
export class WarehouseService implements IWarehouseService<MoyskladService> {
  constructor(
    private moyskladService: MoyskladService,
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

  async getStockOfProductByWarehouseIdCityNameAndGram(
    uuid: Uuid,
    city: CityName,
    gram: number,
  ) {
    try {
      const gramInString = `${gram}гр`;
      const getProduct = async () => await this.moyskladService.getProductById(uuid);

      let product = await getProduct();

      if (!product) {
        setTimeout(async () => { product = await getProduct() }, 600);
        console.log('once product');
        console.log(product);
        if (!product) {
          console.log('twice product');
          console.log(product);
          setTimeout(async () => { product = await getProduct() }, 600);
          if (!product) {
            throw new BadRequestException(
              `Продукта с id ${uuid} не существует`,
            );
          }
        }
      }

      const getModifiaction = async () =>
        await this.moyskladService.getModificationByProductIdAndGram(
          product.id,
          gramInString,
        );

      let modification = await getModifiaction();

      if (!modification) {
          setTimeout(async () => { modification = await getModifiaction() }, 1200);
        console.log('once modification');
        console.log(new Date());
        console.log(modification);
        if (!modification) {
        console.log('twice modification');
        console.log(new Date());
        console.log(modification);
          setTimeout(async () => { modification = await getModifiaction() }, 1200);
        } if (!modification) {
          throw new BadRequestException(
            `Модификации с id продукта ${product.id} или кол-вом граммов ${gramInString} не существует`);
        }
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

  async createOrder(assortment: ModificationDto[], meta: CreateOrderMeta) {
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
