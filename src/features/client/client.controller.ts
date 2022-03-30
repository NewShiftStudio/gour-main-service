import { Client } from '../../entity/Client';
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
import { ClientGetListDto } from './dto/ClientGetListDto';
import { ClientCreateDto } from './dto/ClientCreateDto';
import { ClientsService } from './client.service';
import { ApiTags } from '@nestjs/swagger';
import { ClientUpdateDto } from './dto/client.update.dto';

@ApiTags('clients')
@Controller()
export class ClientController {
  constructor(private readonly clientService: ClientsService) {}

  @Get('/clients')
  getAll(@Query() params: ClientGetListDto) {
    return this.clientService.findMany(params);
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
