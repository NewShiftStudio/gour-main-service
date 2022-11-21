import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Meta } from '../../entity/Meta';

@Injectable()
export class MetaService {
  metaAccessTokenKey = process.env.META_ACCESS_TOKEN_KEY;
  metaRefreshTokenKey = process.env.META_REFRESH_TOKEN_KEY;

  constructor(
    @InjectRepository(Meta) readonly metaRepository: Repository<Meta>,
  ) {}

  getTokenExpiration(key: string, updatedAt: Date) {
    switch (key) {
      case this.metaAccessTokenKey:
        return new Date(updatedAt.setDate(updatedAt.getDate() + 1));

      case this.metaRefreshTokenKey:
        return new Date(updatedAt.setMonth(updatedAt.getMonth() + 3));

      default:
        throw new BadRequestException('Неверный ключ токена');
    }
  }

  setValue(key: string, value: string | number | object) {
    return this.metaRepository.save({
      key,
      value: JSON.stringify(value),
    });
  }

  async getValue(key: string): Promise<string | number | object> {
    const meta = await this.metaRepository.findOne({
      key,
    });

    const metaValue = JSON.parse(meta.value);

    return metaValue;
  }

  async getMeta(key: string): Promise<Meta> {
    const { value, ...meta } = await this.metaRepository.findOne({
      key,
    });

    const parsedValue = JSON.parse(value);

    return { ...meta, value: parsedValue };
  }
}
