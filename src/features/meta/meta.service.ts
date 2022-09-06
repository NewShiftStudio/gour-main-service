import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Meta } from '../../entity/Meta';

@Injectable()
export class MetaService {
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

    const value = JSON.parse(meta.value);

    if (value) return value;
    throw new NotFoundException(`Значение meta с key = ${key} не найдено`);
  }

  async getMeta(key: string): Promise<Meta> {
    const meta = await this.metaRepository.findOne({
      key,
    });

    if (meta) return JSON.parse(meta.value);
    throw new NotFoundException(`Meta с key = ${key} не найдена`);
  }
}
