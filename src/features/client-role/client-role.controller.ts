import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { ClientRole } from '../../entity/ClientRole';
import { ClientRoleService } from './client-role.service';
import { ClientRoleCreateDto } from './dto/client-role-create.dto';
import { BaseGetListDto } from '../../common/dto/base-get-list.dto';

@ApiTags('clientRoles')
@Controller()
export class ClientRoleController {
  constructor(private readonly clientRoleService: ClientRoleService) {}

  @MessagePattern('get-client-roles')
  getAll(@Payload() params: BaseGetListDto) {
    return this.clientRoleService.findMany(params);
  }

  @MessagePattern('get-client-role')
  getOne(@Payload() id: string) {
    return this.clientRoleService.getOne(+id);
  }

  @MessagePattern('create-client-role')
  post(@Payload() clientRole: ClientRoleCreateDto) {
    return this.clientRoleService.create(clientRole);
  }

  @MessagePattern('edit-client-role')
  put(
    @Payload('id') id: string,
    @Payload('clientRole') clientRole: Partial<ClientRole>,
  ) {
    return this.clientRoleService.update(+id, clientRole);
  }

  @MessagePattern('delete-client-role')
  remove(@Payload() id: string) {
    return this.clientRoleService.remove(+id);
  }
}
