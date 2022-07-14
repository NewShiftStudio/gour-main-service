import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { ClientsService } from './client.service';
import { AuthService } from '../auth/auth.service';
import { ClientGetListDto } from './dto/сlient-get-list.dto';
import { ClientCreateDto } from './dto/сlient-create.dto';
import { ClientUpdateDto } from './dto/client-update.dto';

@ApiTags('clients')
@Controller()
export class ClientController {
  constructor(
    private readonly clientService: ClientsService,
    private readonly authService: AuthService,
  ) {}

  @MessagePattern('get-clients')
  getAll(@Payload() params: ClientGetListDto) {
    // return this.clientService.findMany(params);
    return [{ text: '1234' }];
  }

  @MessagePattern('get-client')
  getOne(@Payload() id: string) {
    return this.clientService.findOne(+id);
  }

  @MessagePattern('create-client')
  post(@Payload() client: ClientCreateDto) {
    return this.clientService.create(client);
  }

  @MessagePattern('edit-client')
  put(@Payload('id') id: string, @Payload('client') client: ClientUpdateDto) {
    return this.clientService.update(+id, client);
  }

  @MessagePattern('delete-client')
  remove(@Payload() id: string) {
    return this.clientService.remove(+id);
  }

  @MessagePattern('login-client')
  login(@Payload() id: string) {
    return this.authService.signinById(+id);
  }
}
