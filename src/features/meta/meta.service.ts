import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Meta } from '../../entity/Meta';

@Injectable()
export class MetaService {
  META_ACCESS_TOKEN_KEY = process.env.META_ACCESS_TOKEN_KEY;
  META_REFRESH_TOKEN_KEY = process.env.META_REFRESH_TOKEN_KEY;

  constructor(
    @InjectRepository(Meta) readonly metaRepository: Repository<Meta>,
  ) {}

  setValue(key: string, value: string | number | object) {
    this.metaRepository.save({
      key,
      value: JSON.stringify(value),
    });
  }

  async getValue(key: string): Promise<string | number | object> {
    const meta = await this.metaRepository.findOne({
      key,
    });

    const metaValue = JSON.parse(meta.value);

    if (!metaValue) throw new NotFoundException('Значение меты не найдено');

    return metaValue;
  }

  async getMeta(key: string): Promise<Meta> {
    const meta = await this.metaRepository.findOne({
      key,
    });

    if (!meta) throw new NotFoundException('Мета не найдено');

    return meta;
  }
}
