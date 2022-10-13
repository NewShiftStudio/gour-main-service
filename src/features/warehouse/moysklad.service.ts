import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  MoyskladAuth,
  MoyskladModification,
  MoyskladProduct,
  MoyskladStock,
  MoyskladStore,
} from './@types/Moysklad';
import { AbstractService, StrategyData } from './@types/WarehouseService';

@Injectable()
export class MoyskladService implements AbstractService {
  constructor(private httpService: HttpService) {}

  async getModificationByProductIdAndGram(uuid: Uuid, gram: GramsInString) {
    const { data } = await firstValueFrom(
      this.httpService.get<MoyskladModification>(`/entity/variant/`, {
        params: {
          filter: `productid=${uuid}`,
        },
      }),
    );
    return data.rows.find((r) => {
      const current = r.characteristics.find((c) => c.value === gram);
      if (current) {
        return {
          id: r.id,
        };
      }
    });
  }

  async getAuthorizationToken({ login, password }: StrategyData['BASIC_AUTH']) {
    const basicAuth = Buffer.from(`${login}:${password}`).toString('base64'); // convert to RFC2045-MIME string
    const res = await firstValueFrom(
      this.httpService.post<MoyskladAuth>(
        '/security/token',
        {},
        {
          headers: {
            Authorization: `Basic ${basicAuth}`,
          },
        },
      ),
    );

    return res.data.access_token;
  }

  async getProductById(uuid: Uuid) {
    const { data } = await firstValueFrom(
      this.httpService.get<MoyskladProduct>(`/entity/product/${uuid}`),
    );
    return data;
  }

  async getStockByAssortmentIdAndStoreId(
    assortmentUuid: Uuid,
    storeUuid: Uuid,
  ) {
    const { data } = await firstValueFrom(
      this.httpService.get<MoyskladStock[]>(
        `/report/stock/all/current?filter=assortmentId=${assortmentUuid}&filter=storeId=${storeUuid}`,
      ),
    );
    return { id: data[0]?.assortmentId, value: data[0]?.stock };
  }

  async getStoreByCityName(city: CityName) {
    const { data } = await firstValueFrom(
      this.httpService.get<MoyskladStore>(`/entity/store/`),
    );

    const row = data.rows.find((r) =>
      r?.addressFull?.city.toLowerCase().includes(city.toLowerCase()),
    );

    return { city: row?.addressFull?.city, id: row?.id };
  }
}
