import { HttpService } from '@nestjs/axios';
import { Controller, Get, Param, Post } from '@nestjs/common';
import { catchError, map } from 'rxjs';
import { encodePhoneCode } from '../auth/jwt.service';
import { SmsSenderService } from './sms-sender.service';

@Controller('sms-sender')
export class SmsSenderController {
  constructor(
    private smsSenderService: SmsSenderService,
    private readonly httpService: HttpService,
  ) {}
}
