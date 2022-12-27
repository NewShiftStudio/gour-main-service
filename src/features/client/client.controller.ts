import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { ClientService } from './client.service';
import { AuthService } from '../auth/auth.service';
import { ClientGetListDto } from './dto/client-get-list.dto';
import { ClientCreateDto } from './dto/client-create.dto';
import { ClientUpdateDto } from './dto/client-update.dto';

@ApiTags('clients')
@Controller('clients')
export class ClientController {
  constructor(
    private readonly clientService: ClientService,
    private readonly authService: AuthService,
  ) {}

  @MessagePattern('get-clients')
  getAll(@Payload() params: ClientGetListDto) {
    return this.clientService.findMany(params);
  }

  @MessagePattern('get-client')
  getOne(@Payload() id: string) {
    return this.clientService.findOne(id);
  }

  @MessagePattern('create-client')
  post(@Payload() dto: ClientCreateDto) {
    return this.clientService.create(dto);
  }

  @MessagePattern('edit-client')
  put(@Payload('id') id: string, @Payload('dto') dto: ClientUpdateDto) {
    return this.clientService.update(id, dto);
  }

  @MessagePattern('delete-client')
  remove(@Payload() id: string) {
    return this.clientService.remove(id);
  }

  @MessagePattern('login-client')
  login(@Payload() id: string) {
    return this.authService.signinById(id);
  }
}
