import { Controller } from '@nestjs/common';
import { CityCreateDto } from './dto/city-create.dto';
import { CityService } from './city.service';
import { BaseGetListDto } from '../../common/dto/base-get-list.dto';
import { CityUpdateDto } from './dto/city-update.dto';
import { ApiTags } from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices';

@ApiTags('cities')
@Controller()
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @MessagePattern('get-cities')
  getAll(@Payload() params: BaseGetListDto) {
    return this.cityService.findMany(params);
  }

  @MessagePattern('get-city')
  getOne(@Payload() id: string) {
    return this.cityService.getOne(+id);
  }

  @MessagePattern('create-city')
  post(@Payload() city: CityCreateDto) {
    return this.cityService.create(city);
  }

  @MessagePattern('edit-city')
  put(@Payload('id') id: string, @Payload('city') city: CityUpdateDto) {
    return this.cityService.update(+id, city);
  }

  @MessagePattern('delete-city')
  remove(@Payload() id: string) {
    return this.cityService.remove(+id);
  }
}
