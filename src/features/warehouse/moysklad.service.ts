import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  ApiResponse,
  MoyskladModification,
  MoyskladProduct,
  MoyskladStock,
  MoyskladStore,
} from './@types/Moysklad';
import {
  AbstractModification,
  AbstractProduct,
  AbstractService,
  AbstractStock,
  AbstractStore,
} from './@types/WarehouseService';

@Injectable()
export class MoyskladService implements AbstractService {
  constructor(private httpService: HttpService) {}

  async getModificationByProductIdAndGram(
    uuid: Uuid,
    gram: GramsInString,
  ): ApiResponse<AbstractModification> {
    const { data } = await firstValueFrom(
      this.httpService.get<MoyskladModification>(`/entity/variant/`, {
        params: {
          filter: `productid=${uuid}`,
        },
      }),
    );
    return data.rows.reduce<AbstractModification>((acc, r) => {
      const current = r.characteristics.find((c) => c.value === gram);
      if (current) acc.id = r.id;
      return acc;
    }, {} as AbstractModification);
  }

  async getProductById(uuid: Uuid): ApiResponse<AbstractProduct> {
    const { data } = await firstValueFrom(
      this.httpService.get<MoyskladProduct>(`/entity/product/${uuid}`),
    );
    return data;
  }

  async getStockByAssortmentIdAndStoreId(
    assortmentUuid: Uuid,
    storeUuid: Uuid,
  ): ApiResponse<AbstractStock> {
    const { data } = await firstValueFrom(
      this.httpService.get<MoyskladStock[]>(
        `/report/stock/all/current?filter=assortmentId=${assortmentUuid}&filter=storeId=${storeUuid}`,
      ),
    );
    return { id: data[0]?.assortmentId, value: data[0].stock };
  }

  async getStoreByCityName(city: CityName): ApiResponse<AbstractStore> {
    const { data } = await firstValueFrom(
      this.httpService.get<MoyskladStore>(`/entity/store/`),
    );

    const row = data.rows.find((r) =>
      r?.addressFull.city.toLowerCase().includes(city.toLowerCase()),
    );

    return { city: row.addressFull.city, id: row.id };
  }
}
