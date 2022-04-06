import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from '../../entity/City';
import { getPaginationOptions } from '../../common/helpers/controllerHelpers';
import { CityCreateDto } from './dto/CityCreateDto';
import { BaseGetListDto } from '../../common/dto/BaseGetListDto';
import {CityUpdateDto} from "./dto/city.update.dto";

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
    private cityRepository: Repository<City>,
  ) {}

  findMany(params: BaseGetListDto) {
    return this.cityRepository.findAndCount({
      ...getPaginationOptions(params.offset, params.length),
    });
  }

  getOne(id: number) {
    return this.cityRepository.findOne({ id });
  }

  create(city: CityCreateDto) {
    return this.cityRepository.save(city);
  }

  update(id: number, city: CityUpdateDto) {
    return this.cityRepository.save({
      ...city,
      id,
    });
  }

  remove(id: number) {
    return this.cityRepository.delete(id);
  }
}
