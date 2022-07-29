import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { ClientRoleService } from './client-role.service';
import { ClientRoleCreateDto } from './dto/client-role-create.dto';
import { BaseGetListDto } from '../../common/dto/base-get-list.dto';
import { ClientRoleUpdateDto } from './dto/client-role-update.dto';

@ApiTags('client-roles')
@Controller('client-roles')
export class ClientRoleController {
  constructor(private readonly clientRoleService: ClientRoleService) {}

  @MessagePattern('get-client-roles')
  getAll(@Payload() params: BaseGetListDto) {
    return this.clientRoleService.findMany(params);
  }

  @MessagePattern('get-client-role')
  async getOne(@Payload() id: number) {
    const clientRole = await this.clientRoleService.getOne(id);

    return [clientRole];
  }

  // TODO bad request exception on @Payload() dto: ClientRoleCreateDto
  @MessagePattern('create-client-role')
  post(@Payload('dto') dto: ClientRoleCreateDto) {
    return this.clientRoleService.create(dto);
  }

  @MessagePattern('edit-client-role')
  put(@Payload('id') id: number, @Payload('dto') dto: ClientRoleUpdateDto) {
    return this.clientRoleService.update(id, dto);
  }

  @MessagePattern('delete-client-role')
  remove(@Payload() id: number) {
    return this.clientRoleService.remove(id);
  }
}
