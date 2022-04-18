import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { Client } from '../../entity/Client';
import { AppRequest } from './auth.controller';
import { decodeToken } from './jwt.service';
import { getToken } from './auth.service';

export const CurrentUser = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request: AppRequest = ctx.switchToHttp().getRequest();
    const decodedUser = decodeToken(getToken(request)) as { id: number };
    console.log('decodedUser', decodedUser);
    if (!decodedUser) {
      return null;
    }

    console.log('request.client', decodedUser);

    return getRepository(Client).findOne({
      where: {
        id: decodedUser.id,
      },
    });
  },
);
