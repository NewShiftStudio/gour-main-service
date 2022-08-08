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
export class TestService {
  access_token: string;

  constructor(@Inject(MetaService) readonly metaService: MetaService) {
    this.metaService.getValue(META_ACCESS_TOKEN_KEY).then((result) => {
      if (result) this.access_token = result as string;
    });
  }

  async getAuthToken(): Promise<object> {
    try {
      const res = await amoCrmApi.post('/oauth2/access_token', {
        client_id: process.env.AMO_CLIENT_ID,
        client_secret: process.env.AMO_CLIENT_SECRECT,
        grant_type: 'refresh_token',
        //todo текущий рефреш токен(он не истекает 3 месяца) но при запросе нового аксеса - меняется!
        refresh_token:
          'def50200f244c325179efabe68329423f87e08037aba85dd3e8db2dc2f168a66d8a33f14fabef2a2835c259809b0615e73b50b75e2deb4f79c32f25fc48307164983317c97d9ce7e190344bcee6f77c8d4ae524d4c15bfdc75ab52d14c3d69b9d09df2109cf5b6893bc39d79757fa98b35f380137c89b7758d84d96857f192a3510663fb345944bd7b83fd4d5a53cf2594d09eee5e86f83d5a086de7b7c7802c64a543a4654a856d66f870e5207ca5b91f6e193275556bcce19b528a86c72f3ec369dc5c4aef3c6cae4e621ec38a1545a210024fb9ac61a7d604093361e0b8cdb149272bb9ed8c7f080d1b66a804fff1bc5380143187811d7ed84c1e9292d14a7cc550c6523bf1da6d1fff1c0513cd6a7462e9856c3ca3a91919f1f5546bb8ae6938ba25446fc5a05af7f024834d79baa02b34b7c6b20e772e3023ae8fddbd0ccd97b92d834aa689d29e51637a06429f77a887d15a6b3ca0da3b75a9ee6d47ee3bd451f85d251a54558d7cc95a12c526f6771f64f769def404462a2922d45c806050bed76fc2e7a88aff2e049fce82262a206096c3d8b745e023fab0b5b214bbcef9a9c6a19973cb122988dc1de22afce74872873879059ddc9d2e50b9f848bc33ebf704276ff4dc12cbdf4aefc580ce4362df6fcee5195c476897',
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

      this.access_token = JSON.stringify(res.data.access_token);

      if (res.status === 200 || res.status === 201) {
        return res;
      }
    } catch (error) {
      console.error('getAuthToken refresh_token error', error);
    }
  }

  async getAllOrderStatuses(): Promise<[]> {
    if (!this.access_token) await this.getAuthToken();

    try {
      const orders = await amoCrmApi.get(`/api/v4/leads`, {
        headers: { Authorization: `Bearer ${this.access_token}` },
      });
      if (orders.status === 200 || orders.status === 201) {
        return orders.data;
      }
    } catch (error) {
      console.error('getAllStatusesAMO error', error);
    }
  }
}
