import { HttpException, Injectable } from '@nestjs/common';
import { Meta } from '../../entity/Meta';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
    if (!meta) {
      throw new HttpException(`Meta with key = ${key} was not found`, 400);
    }
    return JSON.parse(meta.value);
  }
}
