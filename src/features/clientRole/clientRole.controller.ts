import { ClientRole } from '../../entity/ClientRole';
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
import { ClientRoleCreateDto } from './dto/clientRole.create.dto';
import { ClientRoleService } from './clientRole.service';
import { BaseGetListDto } from '../../common/dto/BaseGetListDto';
import { ApiTags } from '@nestjs/swagger';
import { TOTAL_COUNT_HEADER } from '../../constants/httpConstants';
import { Response } from 'express';

@ApiTags('clientRoles')
@Controller()
export class ClientRoleController {
  constructor(private readonly clientRoleService: ClientRoleService) {}

  @Get('/clientRoles')
  async getAll(@Query() params: BaseGetListDto, @Res() res: Response) {
    const [clients, count] = await this.clientRoleService.findMany(params);

    res.set(TOTAL_COUNT_HEADER, count.toString());
    return res.send(clients);
  }

  @Get('/clientRoles/:id')
  getOne(@Param('id') id: number) {
    return this.clientRoleService.getOne(id);
  }

  @Post('/clientRoles')
  async post(@Body() clientRole: ClientRoleCreateDto) {
    return this.clientRoleService.create(clientRole);
  }

  @Put('/clientRoles/:id')
  put(@Param('id') id: number, @Body() clientRole: Partial<ClientRole>) {
    return this.clientRoleService.update(id, clientRole);
  }

  @Delete('/clientRoles/:id')
  remove(@Param('id') id: number) {
    return this.clientRoleService.remove(id);
  }
}
