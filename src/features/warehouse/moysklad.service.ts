import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  CreateOrderMeta,
  MoyskladAgent,
  MoyskladAuth,
  MoyskladMetadata,
  MoyskladModification,
  MoyskladOrder,
  MoyskladProduct,
  MoyskladState,
  MoyskladStock,
  MoyskladStore,
  MoyskladWebhook,
} from './@types/Moysklad';
import {
  AbstractAssortment,
  AbstractService,
  StrategyData,
} from './@types/WarehouseService';
import { CreateWarehouseAgentDto } from './dto/create-agent.dto';

const refreshStatusUpdateUrl = process.env.REFRESH_ORDER_STATUS_URL;

@Injectable()
export class MoyskladService implements AbstractService {
  constructor(private httpService: HttpService) {}

  onModuleInit() {
    this.subscribeOnOrderStatusUpdate();
  }

  async subscribeOnOrderStatusUpdate() {
    const action = 'UPDATE';
    const entityType = 'customerorder';

    const getWebhooksResponse = await firstValueFrom(
      this.httpService.get('/entity/webhook/'),
    );

    const webhooks: MoyskladWebhook[] = getWebhooksResponse.data.rows;

    const statusUpdateWebhook = webhooks.find(
      ({
        action: webhookAction,
        entityType: webhookEntityType,
        url: webhookUrl,
      }) =>
        webhookAction === action &&
        webhookEntityType === entityType &&
        webhookUrl === refreshStatusUpdateUrl,
    );

    if (!statusUpdateWebhook) {
      const createWebhookResponse = await firstValueFrom(
        this.httpService.post<MoyskladWebhook>('/entity/webhook/', {
          url: refreshStatusUpdateUrl,
          action,
          entityType,
        }),
      );

      const newStatusUpdateWebhook = createWebhookResponse.data;

      if (!newStatusUpdateWebhook) {
        console.log('ORDER STATUS UPDATE WEBHOOK: ERROR');
        return;
      }

      return newStatusUpdateWebhook;
    }

    console.log('ORDER STATUS UPDATE WEBHOOK: RUNNING');

    return statusUpdateWebhook;
  }

  async getModificationByProductIdAndGram(uuid: Uuid, gram: GramsInString) {
    const { data } = await firstValueFrom(
      this.httpService.get<MoyskladModification>(`/entity/variant/`, {
        params: {
          filter: `productid=${uuid}`,
        },
      }),
    );

    if (!data)
      throw new InternalServerErrorException(
        'Не удалось получить модификацию продукта',
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

  async createWarehouseAgent(agent: CreateWarehouseAgentDto) {
    const { data } = await firstValueFrom(
      this.httpService.post<MoyskladAgent>('/entity/counterparty/', agent),
    );
    return data;
  }

  async getOrder(uuid: string) {
    const { data } = await firstValueFrom(
      this.httpService.get<MoyskladOrder>(`/entity/customerorder/${uuid}`),
    );

    if (!data)
      throw new InternalServerErrorException(
        'Не удалось получить заказ из МоегоСклада',
      );

    return data;
  }

  async getState(uuid: string) {
    const { data } = await firstValueFrom(
      this.httpService.get<MoyskladState>(
        `/entity/customerorder/metadata/states/${uuid}`,
      ),
    );

    if (!data)
      throw new InternalServerErrorException(
        'Не удалось получить состояние заказа из МоегоСклада',
      );

    return data;
  }

  async getStates() {
    const { data } = await firstValueFrom(
      this.httpService.get<MoyskladMetadata>(`/entity/customerorder/metadata`),
    );

    if (!data)
      throw new InternalServerErrorException(
        'Не удалось получить состояния заказа из МоегоСклада',
      );

    return data.states;
  }

  async getStateByName(name: string) {
    const states = await this.getStates();
    const state = states.find((it) => it.name === name);

    if (!state)
      throw new NotFoundException(
        'Не удалось найти состояние заказа из МоегоСклада по имени',
      );

    return state;
  }

  async updateOrderState(uuid: string, state: MoyskladState) {
    const { data } = await firstValueFrom(
      this.httpService.put<MoyskladOrder>(`/entity/customerorder/${uuid}`, {
        state,
      }),
    );

    if (!data)
      throw new InternalServerErrorException(
        'Не удалось обновить состояние заказа в Моём складе',
      );

    return data;
  }

  async createOrder(assortment: AbstractAssortment[], meta: CreateOrderMeta) {
    const { data } = await firstValueFrom(
      this.httpService.post<MoyskladOrder>('/entity/customerorder', {
        organization: {
          meta: {
            href: `${process.env.WAREHOUSE_API_URL}/entity/organization/${meta?.organizationId}`,
            metadataHref: `${process.env.WAREHOUSE_API_URL}/entity/organization/metadata`,
            type: 'organization',
            mediaType: 'application/json',
          },
        },
        agent: {
          meta: {
            href: `${process.env.WAREHOUSE_API_URL}entity/counterparty/${meta.counterpartyId}`,
            type: 'counterparty',
            mediaType: 'application/json',
          },
        },
        shipmentAddressFull: {
          apartment: meta.apartment,
          house: meta.house,
          city: meta.city,
          street: meta.street,
          postalCode: meta.postalCode,
          addInfo: meta.addInfo || 'addInfo',
          comment: meta.comment || '',
        },
        positions: assortment.map((ass) => ({
          quantity: ass.quantity,
          price: ass.price,
          discount: ass.discount,
          reserve: ass.quantity,
          vat: 0,
          assortment: {
            meta: {
              href: `${process.env.WAREHOUSE_API_URL}/entity/${ass.type}/${ass.id}`,
              metadataHref: `${process.env.WAREHOUSE_API_URL}/entity/${ass.type}/metadata`,
              type: ass.type,
              mediaType: 'application/json',
            },
          },
        })),
      }),
    );

    if (!data)
      throw new InternalServerErrorException(
        'Не удалось создать заказ в Моём складе',
      );

    return data;
  }
}
