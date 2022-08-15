import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { HttpException, Inject, Injectable } from '@nestjs/common';

import { MetaService } from '../meta/meta.service';
import { LeadCreateDto } from './dto/lead-create.dto';
import { LeadDto } from './dto/lead.dto';

const amoCrmApi: AxiosInstance = axios.create({
  baseURL: `${process.env.AMO_BASE_URL}`,
});

const pipelineId = 4569880;
const websiteTicketStatus = 45278836;
const paymentSuccessStatus = 42092803;
const COMMENT_CUSTOM_FIELD_ID = 1401695;

const META_REFRESH_TOKEN_KEY = 'AMO_REFRESH_TOKEN';
const META_ACCESS_TOKEN_KEY = 'AMO_ACCESS_TOKEN';

@Injectable()
export class AmoCrmService {
  access_token: string;

  constructor(@Inject(MetaService) readonly metaService: MetaService) {
    this.metaService
      .getMeta(META_ACCESS_TOKEN_KEY)
      .then((accessTokenMeta) => {
        const accessTokenIsExpired = this.checkTokenExpiration(
          'access',
          accessTokenMeta.updatedAt,
        );

        if (accessTokenIsExpired) this.auth();
        else this.access_token = JSON.parse(accessTokenMeta.value);
      })
      .catch((error) => console.log('getAccessMeta error', error));
  }

  checkTokenExpiration(type: 'access' | 'refresh', lastUpdate: Date) {
    const now = new Date();

    const tokenExpiresIn = new Date(
      type === 'access'
        ? lastUpdate.setDate(lastUpdate.getDate() + 1)
        : lastUpdate.setMonth(lastUpdate.getMonth() + 3),
    );

    const isExpired = now > tokenExpiresIn;

    return isExpired;
  }

  //todo Думаю в целом необходимо создать родительский класс типо Order который может в себя включать:
  // - cвой id,status etc , массив товаров(id, weight, etc); пользователя(id, телефон etc),

  async auth(): Promise<object> {
    try {
      const refreshTokenMeta = await this.metaService.getMeta(
        META_REFRESH_TOKEN_KEY,
      );

      const refreshTokenIsExpired = this.checkTokenExpiration(
        'refresh',
        refreshTokenMeta.updatedAt,
      );

      const data = !refreshTokenIsExpired
        ? {
            client_id: process.env.AMO_CLIENT_ID,
            client_secret: process.env.AMO_CLIENT_SECRECT,
            grant_type: 'refresh_token',
            refresh_token: JSON.parse(refreshTokenMeta.value),
            redirect_uri: process.env.AMO_REDIRECT_URI,
          }
        : {
            client_id: process.env.AMO_CLIENT_ID,
            client_secret: process.env.AMO_CLIENT_SECRECT,
            grant_type: 'authorization_code',
            code: process.env.AMO_AUTH_CODE,
            redirect_uri: process.env.AMO_REDIRECT_URI,
          };

      const response: AxiosResponse<{
        refresh_token: string;
        access_token: string;
      }> = await amoCrmApi.post('/oauth2/access_token', data);

      this.metaService.setValue(
        META_REFRESH_TOKEN_KEY,
        response.data.refresh_token,
      );
      this.metaService.setValue(
        META_ACCESS_TOKEN_KEY,
        response.data.access_token,
      );

      this.access_token = response.data.access_token;

      if (response.status === 200 || response.status === 201) return response;
    } catch (error) {
      console.error('getAuthToken error', error);
    }
  }

  async getAllLeads() {
    try {
      const { data: leads } = await amoCrmApi.get('api/v4/leads', {
        headers: {
          Authorization: `Bearer ${this.access_token}`,
        },
      });

      return leads;
    } catch (error) {
      console.error('getAllLeadsAMO error', error);
    }
  }

  async createLead(createLeadDto: LeadCreateDto) {
    try {
      const { data: result } = await amoCrmApi.post(
        'api/v4/leads',
        [
          {
            name: createLeadDto.name,
            price: createLeadDto.price,
            status_id: websiteTicketStatus,
            custom_fields_values: [
              {
                field_id: COMMENT_CUSTOM_FIELD_ID,
                values: [
                  {
                    value: createLeadDto.description,
                  },
                ],
              },
            ],
          },
        ],
        {
          headers: { Authorization: `Bearer ${this.access_token}` },
        },
      );

      const lead = result._embedded.leads[0];

      if (lead) return lead;
      throw new HttpException('Failed to create a lead', 400);
    } catch (error) {
      console.error('createLeadAMO error', error);
    }
  }

  // Может быть полезен для получения списка существующих статусов

  async getAllOrderStatuses(): Promise<[]> {
    try {
      const orders = await amoCrmApi.get(
        `/api/v4/leads/pipelines/${pipelineId}`,
        {
          headers: { Authorization: `Bearer ${this.access_token}` },
        },
      );
      return orders.data;
    } catch (error) {
      console.error('getAllStatusesAMO error', error);
    }
  }

  async getLeadList(): Promise<LeadDto[]> {
    try {
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

      const leadList = leads.map((it) => ({
        ...it,
        status: statusesById[it.status_id],
      }));

      return leadList;
    } catch (error) {
      console.error('getAllStatusesAMO error', error);
    }
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

      const fullLead = {
        ...lead,
        status,
      };

      return fullLead;
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
  }): Promise<object> {
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

  async getFields() {
    try {
      const { data: fields } = await amoCrmApi.get(
        '/api/v4/leads/custom_fields',
        {
          headers: { Authorization: `Bearer ${this.access_token}` },
        },
      );

      return fields;
    } catch (error) {
      console.error('getAllFieldsAMO error', error);
    }
  }
}
