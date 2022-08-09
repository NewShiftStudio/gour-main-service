import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { getRepository } from 'typeorm';
import { Client } from '../../entity/Client';
import { AppRequest } from './auth.controller';
import { decodeToken } from './jwt.service';
import { getToken } from './auth.service';

export const CurrentUser = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request: AppRequest = ctx.switchToHttp().getRequest();
    const decodedUser = decodeToken(getToken(request)) as { id: number };
    if (!decodedUser) {
      throw new UnauthorizedException();
    }

    return getRepository(Client).findOne({
      where: {
        id: decodedUser.id,
      },
      relations: ['referralCode'],
    });
  },
);
