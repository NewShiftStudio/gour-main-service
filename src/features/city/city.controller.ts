import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { CityCreateDto } from './dto/CityCreateDto';
import { CityService } from './city.service';
import { BaseGetListDto } from '../../common/dto/BaseGetListDto';
import { CityUpdateDto } from './dto/city.update.dto';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { TOTAL_COUNT_HEADER } from '../../constants/httpConstants';

@ApiTags('cities')
@Controller()
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get('/cities')
  async getAll(@Query() params: BaseGetListDto, @Res() res: Response) {
    const [clients, count] = await this.cityService.findMany(params);

    res.set(TOTAL_COUNT_HEADER, count.toString());
    return res.send(clients);
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
  put(@Param('id') id: string, @Body() city: CityUpdateDto) {
    return this.cityService.update(+id, city);
  }

  @Delete('/cities/:id')
  remove(@Param('id') id: number) {
    return this.cityService.remove(id);
  }
}
