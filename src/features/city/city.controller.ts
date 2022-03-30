import { City } from '../../entity/City';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CityCreateDto } from './dto/CityCreateDto';
import { CityService } from './city.service';
import { BaseGetListDto } from '../../common/dto/BaseGetListDto';
import { CityUpdateDto } from './dto/city.update.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('cities')
@Controller()
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get('/cities')
  getAll(@Query() params: BaseGetListDto) {
    return this.cityService.findMany(params);
  }

  @Get('/cities/:id')
  getOne(@Param('id') id: number) {
    return this.cityService.getOne(id);
  }

  @Post('/cities')
  async post(@Body() city: CityCreateDto) {
    return this.cityService.create(city);
  }

  @Put('/cities/:id')
  put(@Param('id') id: number, @Body() city: CityUpdateDto) {
    return this.cityService.update(id, city);
  }

  @Delete('/cities/:id')
  remove(@Param('id') id: number) {
    return this.cityService.remove(id);
  }
}
