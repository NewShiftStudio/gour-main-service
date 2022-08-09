import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

import { CityService } from './city.service';
import { BaseGetListDto } from '../../common/dto/base-get-list.dto';
import { CityCreateDto } from './dto/city-create.dto';
import { CityUpdateDto } from './dto/city-update.dto';

@ApiTags('cities')
@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @MessagePattern('get-cities')
  getAll(@Payload() params: BaseGetListDto) {
    return this.cityService.findMany(params);
  }

  @MessagePattern('get-city')
  getOne(@Payload() id: number) {
    return this.cityService.getOne(id);
  }

  @MessagePattern('create-city')
  post(@Payload() dto: CityCreateDto) {
    return this.cityService.create(dto);
  }

  @MessagePattern('edit-city')
  put(@Payload('id') id: number, @Payload('dto') dto: CityUpdateDto) {
    return this.cityService.update(id, dto);
  }

  @MessagePattern('delete-city')
  remove(@Payload() id: number) {
    return this.cityService.remove(id);
  }
}
