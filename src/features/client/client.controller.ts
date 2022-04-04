import { Client } from '../../entity/Client';
import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ClientGetListDto } from './dto/ClientGetListDto';
import { ClientCreateDto } from './dto/ClientCreateDto';
import { ClientsService } from './client.service';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { ClientUpdateDto } from './dto/client.update.dto';
import { Response } from 'express';
import { TOTAL_COUNT_HEADER } from '../../constants/httpConstants';

@ApiTags('clients')
@Controller()
export class ClientController {
  constructor(private readonly clientService: ClientsService) {}

  @ApiHeader({
    name: TOTAL_COUNT_HEADER,
  })
  @Get('/clients')
  async getAll(@Query() params: ClientGetListDto, @Res() res: Response) {
    const [clients, count] = await this.clientService.findMany(params);

    res.set(TOTAL_COUNT_HEADER, count.toString());
    return res.send(clients);
  }

  @Get('/clients/:id')
  getOne(@Param('id') id: number) {
    return this.clientService.findOne(id);
  }

  @Post('/clients')
  async post(@Body() client: ClientCreateDto) {
    return this.clientService.create(client);
  }

  @Put('/clients/:id')
  put(@Param('id') id: number, @Body() client: ClientUpdateDto) {
    return this.clientService.update(id, client);
  }

  @Delete('/clients/:id')
  remove(@Param('id') id: number) {
    return this.clientService.remove(id);
  }
}
