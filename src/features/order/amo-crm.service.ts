import axios, { AxiosInstance } from 'axios';
import { Injectable } from '@nestjs/common';

const amoCrmApi: AxiosInstance = axios.create({
  baseURL: `${process.env.AMO_BASE_URL}`,
});

const pipelineId = 4569880;
const websiteTicketStatus = 45278836;
const paymentSuccessStatus = 42092803;

@Injectable()
export class AmoCrmService {
  access_token: string;

  //todo Думаю в целом необходимо создать родительский класс типо Order который может в себя включать:
  // - cвой id,status etc , массив товаров(id, weight, etc); пользователя(id, телефон etc),

  async getAuthToken(): Promise<object> {
    try {
      const token = await amoCrmApi.post('/oauth2/access_token', {
        client_id: process.env.AMO_CLIENT_ID,
        client_secret: process.env.AMO_CLIENT_SECRECT,
        grant_type: 'refresh_token',
        //todo текущий рефреш токен(он не истекает 3 месяца) но при запросе нового аксеса - меняется!
        refresh_token:
          'def502001d76ec9a8175af8d23772b1e10e4f1815445dcd9ffdfb6ad959eafd1c78017a4bf60e18fdb2403b3e36fceef58785b218161ce0165b3b084f5956e1834b879da609f13f3013fe1f2861421dc8c62210c207e0667fc392e2a96f8ab001f72b7d0226e21034273d29a04a96b545e5631fb3755d9bb8d82a2e1bafb74d3b7c3393675487054d7594ef75026ff95cf2d08da3001cde73972cc2634abcd19a36346bd1aa5404b458d1838c01f0a3ab66517908a7aecd21b1414149c6f988a8ecfd9d3cc2390a26f7128d6a396088f92182f0ddbb48d5c9e83cf9b3774a9c52d5847d8ca7681ff97b90d9a4fa2f069138c433f430477eb44071738f178e6f0b19163dbd93865123d54a2063f458148b7a9267d4d622c0cb6025d4102064d7a73bc49013c163dc17069bd66152d2eec76700626a69ca2d353b54f30cacf18e542478bc232472985f390820419fe17e84541004aacd9ffef58d6c6221f0780ae18e4ed6c4601298fd3e827d274a323cef379b8a0bc0b8964649b0ffa7fd1ed20fb863d227fdbc74988523a6a47d01cbe3b9dec5fa8316bfaa77c5b28e8416d3733d5711bb43259382476ad45848ebce8045ae7f1f6154eaf96be9e68d3924b8f31b919a9b8c98f3cb541',
        redirect_uri: process.env.AMO_REDIRECT_URI,
      });
      //Todo Положить токен в базу вместе со временем сессии и запрашивать по окончанию или при работе, дальше можно работать с аксесс токеном
      // Важно(!) рефреш токен всегда приходит новый вместе с аксесс токеном
      // "token_type": "Bearer",
      // "expires_in": 86400,
      // function saveToken(token) {
      // this.access_token = token.access_token
      //     setItem('tokenData', JSON.stringify(token)); ?
      //
      if (token.status === 200 || token.status === 201) {
        return token;
      }
    } catch (error) {
      console.error('getAuthToken refresh_token error', error);
    }
  }

  async getAllOrderStatuses(): Promise<[]> {
    try {
      const orders = await amoCrmApi.get(
        `/api/v4/leads/pipelines/${pipelineId}`,
        {
          headers: { Authorization: `Bearer ${this.access_token}` },
        },
      );
      if (orders.status === 200 || orders.status === 201) {
        return orders.data;
      }
    } catch (error) {
      console.error('getAllStatusesAMO error', error);
    }
  }

  async getOneOrderStatus(id): Promise<[]> {
    try {
      const order = await amoCrmApi.get(`/api/v4/leads/${id}`, {
        headers: { Authorization: `Bearer ${this.access_token}` },
      });
      if (order.status === 200 || order.status === 201) {
        return order.data;
      }
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
