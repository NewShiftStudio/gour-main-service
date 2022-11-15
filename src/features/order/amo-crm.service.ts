import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { MetaService } from '../meta/meta.service';
import { LeadCreateDto } from './dto/lead-create.dto';
import { LeadDto } from './dto/lead.dto';
import { AmoCrmStatus } from './@types/AmoCrm';
import { statuses } from '../warehouse/moysklad.helper';

const amoCrmApi: AxiosInstance = axios.create({
  baseURL: `${process.env.AMO_BASE_URL}`,
});

const pipelineId = process.env.PIPELINE_ID;
const commentCustomFieldId = process.env.COMMENT_CUSTOM_FIELD_ID;

const client_id = process.env.AMO_CLIENT_ID;
const client_secret = process.env.AMO_CLIENT_SECRET;
const redirect_uri = process.env.AMO_REDIRECT_URI;

@Injectable()
export class AmoCrmService {
  access_token: string;

  constructor(@Inject(MetaService) readonly metaService: MetaService) {
    this.metaService
      .getMeta(this.metaService.META_ACCESS_TOKEN_KEY)
      .then((accessTokenMeta) => {
        const accessTokenIsFresh =
          !!accessTokenMeta &&
          this.checkTokenFreshness('access', accessTokenMeta.updatedAt);

        if (accessTokenIsFresh)
          this.access_token = JSON.parse(accessTokenMeta.value);
        else this.auth();
      })
      .catch((error) =>
        console.log('Ошибка получения меты access токена:', error),
      );
  }

  checkTokenFreshness(type: 'access' | 'refresh', lastUpdate: Date) {
    const now = new Date();

    const tokenExpiresIn = new Date(
      type === 'access'
        ? lastUpdate.setDate(lastUpdate.getDate() + 1)
        : lastUpdate.setMonth(lastUpdate.getMonth() + 3),
    );

    return now < tokenExpiresIn;
  }

  async auth(): Promise<object> {
    try {
      const refreshTokenMeta = await this.metaService.getMeta(
        this.metaService.META_REFRESH_TOKEN_KEY,
      );

      const refreshTokenIsFresh =
        !!refreshTokenMeta &&
        this.checkTokenFreshness('refresh', refreshTokenMeta.updatedAt);

      const data = refreshTokenIsFresh
        ? {
            client_id,
            client_secret,
            grant_type: 'refresh_token',
            refresh_token: JSON.parse(refreshTokenMeta.value),
            redirect_uri,
          }
        : {
            client_id,
            client_secret,
            grant_type: 'authorization_code',
            code: process.env.AMO_AUTH_CODE,
            redirect_uri,
          };

      const response: AxiosResponse<{
        refresh_token: string;
        access_token: string;
      }> = await amoCrmApi.post('/oauth2/access_token', data);

      this.metaService.setValue(
        this.metaService.META_REFRESH_TOKEN_KEY,
        response.data.refresh_token,
      );
      this.metaService.setValue(
        this.metaService.META_ACCESS_TOKEN_KEY,
        response.data.access_token,
      );

      this.access_token = response.data.access_token;

      const isSuccess = response.status === 200 || response.status === 201;

      if (isSuccess) return response;
      throw new InternalServerErrorException(
        'Не удалось авторизоваться в amoCRM',
      );
    } catch (error) {
      console.error('Ошибка авторизации amoCRM:', error.response.data);
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
      console.error('Ошибка получения лидов:', error.response.data);
    }
  }

  async createLead({ name, price, description, stateName }: LeadCreateDto) {
    try {
      const status = await this.getStatusByName(stateName);

      //TODO описание заказа
      const { data: result } = await amoCrmApi.post(
        'api/v4/leads',
        [
          {
            name,
            price,
            status_id: status.id,
            // custom_fields_values: [
            //   {
            //     field_id: commentCustomFieldId,
            //     values: [
            //       {
            //         value: description,
            //       },
            //     ],
            //   },
            // ],
          },
        ],
        {
          headers: { Authorization: `Bearer ${this.access_token}` },
        },
      );

      const lead = result._embedded.leads[0];

      if (lead) return lead;
      throw new InternalServerErrorException(
        'Не удалось создать заголовок заказа',
      );
    } catch (error) {
      console.error('Ошибка создания лида:', error.response.data);
    }
  }

  async updateLeadStatus(leadId: number, stateName: string): Promise<object> {
    try {
      const status = await this.getStatusByName(stateName);

      const { data } = await amoCrmApi.patch(
        `api/v4/leads/${leadId}`,
        {
          status_id: status.id,
        },
        {
          headers: { Authorization: `Bearer ${this.access_token}` },
        },
      );

      if (!data)
        throw new InternalServerErrorException(
          'Не удалось обновить статус заголовка заказа',
        );

      return data;
    } catch (error) {
      console.error(
        'Ошибка обновления статуса заголовка заказа:',
        error.response.data,
      );
    }
  }

  async createStatus(name: string, sort: number, color?: string) {
    try {
      const { data: result } = await amoCrmApi.post(
        `api/v4/leads/pipelines/${pipelineId}/statuses`,
        [
          {
            name,
            sort: 150,
            color,
          },
        ],
        {
          headers: { Authorization: `Bearer ${this.access_token}` },
        },
      );

      const status = result._embedded.statuses[0];

      if (status) return status;
      throw new InternalServerErrorException(
        'Не удалось создать статус заказа',
      );
    } catch (error) {
      console.error('Ошибка создания статуса:', error.response.data);
    }
  }

  async getStatusByName(name: string): Promise<AmoCrmStatus> {
    const amoStatuses: AmoCrmStatus[] = await this.getAllOrderStatuses();

    const existingStatus = amoStatuses.find((it) => it.name === name);

    if (existingStatus) return existingStatus;

    const { sort, color } = statuses.find((it) => it.name === name);

    const newStatus = await this.createStatus(name, sort, color);

    return newStatus;
  }

  // Может быть полезен для получения списка существующих статусов
  async getAllOrderStatuses(): Promise<[]> {
    try {
      const { data } = await amoCrmApi.get(
        `/api/v4/leads/pipelines/${pipelineId}`,
        {
          headers: { Authorization: `Bearer ${this.access_token}` },
        },
      );

      const statuses = data._embedded.statuses;

      if (!statuses)
        throw new InternalServerErrorException(
          'Не удалось статусы заказа из amoCrm',
        );
      return statuses;
    } catch (error) {
      console.error('Ошибка получения статусов заказа:', error.response.data);
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
      console.error('Ошибка получения лидов:', error.response.data);
    }
  }

  async getLead(id: number | string): Promise<LeadDto> {
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
      console.error('Ошибка получения лида:', error.response.data);
    }
  }

  async getFields() {
    try {
      const { data } = await amoCrmApi.get('/api/v4/leads/custom_fields', {
        headers: { Authorization: `Bearer ${this.access_token}` },
      });

      const fields = data._embedded;

      return fields;
    } catch (error) {
      console.error('Ошибка получения полей лида:', error.response.data);
    }
  }
}
