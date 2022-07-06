import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { catchError, firstValueFrom, map } from 'rxjs';

if (!process.env.SMS_SERVICE_API_KEY) {
  throw new Error('Added to .env SMS_SERVICE_API_KEY !!');
}

@Injectable()
export class SmsSenderService {
  SMS_BASE_URL = `https://sms.ru/sms/send?api_id=${process.env.SMS_SERVICE_API_KEY}`;

  constructor(private readonly httpService: HttpService) {}

  sendCode(phone: string, code: number) {
    return firstValueFrom(
      this.httpService
        .get(this.SMS_BASE_URL, {
          params: {
            to: phone,
            msg: code,
            json: 1,
          },
        })
        .pipe(map((res) => res.data))
        .pipe(catchError((_, caught) => caught)),
    );
  }
}
