import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { log } from 'util';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaService } from '../meta/meta.service';
import { LeadCreateDto } from './dto/lead.create.dto';
import { LeadDto } from './dto/lead.dto';

const amoCrmApi: AxiosInstance = axios.create({
  baseURL: `${process.env.AMO_BASE_URL}`,
});

const pipelineId = 4569880;
const websiteTicketStatus = 45278836;
const paymentSuccessStatus = 42092803;

const META_REFRESH_TOKEN_KEY = 'AMO_REFRESH_TOKEN';
const META_ACCESS_TOKEN_KEY = 'AMO_ACCESS_TOKEN';

@Injectable()
export class AmoCrmService {
  access_token: string;

  constructor(@Inject(MetaService) readonly metaService: MetaService) {
    this.metaService.getValue(META_ACCESS_TOKEN_KEY).then((result) => {
      if (result) {
        this.access_token = result as string;
      }
    });
  }

  //todo Думаю в целом необходимо создать родительский класс типо Order который может в себя включать:
  // - cвой id,status etc , массив товаров(id, weight, etc); пользователя(id, телефон etc),

  async auth(): Promise<object> {
    try {
      const response: AxiosResponse<{
        refresh_token: string;
        access_token: string;
      }> = await amoCrmApi.post('/oauth2/access_token', {
        client_id: process.env.AMO_CLIENT_ID,
        client_secret: process.env.AMO_CLIENT_SECRECT,
        grant_type: 'refresh_token',
        //todo текущий рефреш токен(он не истекает 3 месяца) но при запросе нового аксеса - меняется!
        refresh_token: process.env.REFRESH_TOKEN_AMO,
        redirect_uri: process.env.AMO_REDIRECT_URI,
      });

      console.log('auth.response', response);

      this.metaService.setValue(
        META_REFRESH_TOKEN_KEY,
        response.data.refresh_token,
      );
      this.metaService.setValue(
        META_ACCESS_TOKEN_KEY,
        response.data.access_token,
      );
      this.access_token = response.data.access_token;
      //Todo Положить токен в базу вместе со временем сессии и запрашивать по окончанию или при работе, дальше можно работать с аксесс токеном
      // Важно(!) рефреш токен всегда приходит новый вместе с аксесс токеном
      // "token_type": "Bearer",
      // "expires_in": 86400,
      // function saveToken(token) {
      // this.access_token = token.access_token
      //     setItem('tokenData', JSON.stringify(token)); ?
      //
      if (response.status === 200 || response.status === 201) {
        return response;
      }
    } catch (error) {
      console.error(error);
      console.error('getAuthToken refresh_token error', error);
    }
  }

  async getAllLeads() {
    // if (!this.access_token) {
    // await this.auth();
    // }
    const { data: leads } = await amoCrmApi.get('api/v4/leads', {
      headers: { Authorization: `Bearer ${this.access_token}` },
    });

    return leads;
  }

  async createLead(createLeadDto: LeadCreateDto) {
    await this.auth();
    try {
      const { data: result } = await amoCrmApi.post(
        'api/v4/leads',
        [
          {
            name: createLeadDto.name,
            price: createLeadDto.price,
            status_id: websiteTicketStatus,
          },
        ],
        {
          headers: { Authorization: `Bearer ${this.access_token}` },
        },
      );
      return result._embedded.leads[0];
    } catch (e) {
      console.error(e.response.data);
      console.error(e.response.data['validation-errors'][0].errors);
      throw new HttpException(e, 400);
    }
  }

  async getAllOrderStatuses(): Promise<[]> {
    if (!this.access_token) {
      await this.auth();
    }
    try {
      const orders = await amoCrmApi.get(
        `/api/v4/leads/pipelines/${pipelineId}`,
        {
          headers: { Authorization: `Bearer ${this.access_token}` },
        },
      );
      console.log('orders', orders.data);
      return orders.data;
    } catch (error) {
      console.error('getAllStatusesAMO error', error);
    }
  }

  async getLeadList(): Promise<LeadDto[]> {
    const statusesResponse = await amoCrmApi.get(
      `/api/v4/leads/pipelines/${pipelineId}/statuses`,
      {
        headers: { Authorization: `Bearer ${this.access_token}` },
      },
    );

    const statuses = statusesResponse.data._embedded.statuses;

    const statusesById = statuses.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});

    const leadsResponse = await amoCrmApi.get(`/api/v4/leads`, {
      headers: { Authorization: `Bearer ${this.access_token}` },
    });
    const leads = leadsResponse.data._embedded.leads;

    return leads.map((it) => ({
      ...it,
      status: statusesById[it.status_id],
    }));
  }

  async getLead(id: number): Promise<LeadDto> {
    try {
      const { data: lead } = await amoCrmApi.get(`/api/v4/leads/${id}`, {
        headers: { Authorization: `Bearer ${this.access_token}` },
      });

      const { data: status } = await amoCrmApi.get(
        `/api/v4/leads/pipelines/${pipelineId}/statuses/${lead.status_id}`,
        {
          headers: { Authorization: `Bearer ${this.access_token}` },
        },
      );
      return {
        ...lead,
        status,
      };
    } catch (error) {
      console.error('getOneStatusAMO error', error);
    }
  }

  async updateStatusOrder({
    id: id,
    createdBy: createdBy,
    createdAt: createdAt,
    name: name,
    price: price,
  }): Promise<{}> {
    //todo связать на id и их их паплайн ид и наш чтобы это было частью продукта
    try {
      const response = await amoCrmApi.patch(`/api/v4/leads/${id}`, [
        {
          id: id, // int id товара
          created_by: createdBy, // int ID пользователя, создающий сделку
          created_at: createdAt, // int Дата создания сделки, передается в Unix Timestamp
          name: name, // string имя - можно использовать под телефон
          price: price, // int Бюджет сделки
          status_id: paymentSuccessStatus || websiteTicketStatus, //todo здесь выбрать на какой статус необходимо изменить: при собранной корзине - website_ticket, при оплаченной корзине когда платежка отдала 200 или 201 - payment_success
          pipeline_id: pipelineId,
        },
      ]);
      if (response.status === 200 || response.status === 201) {
        return response.data;
      }
    } catch (error) {
      console.error('updateStatusAMO error', error);
    }
  }
}
