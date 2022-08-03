import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { ClientsService } from './client.service';
import { AuthService } from '../auth/auth.service';
import { ClientGetListDto } from './dto/сlient-get-list.dto';
import { ClientCreateDto } from './dto/сlient-create.dto';
import { ClientUpdateDto } from './dto/client-update.dto';

@ApiTags('clients')
@Controller('clients')
export class ClientController {
  constructor(
    private readonly clientService: ClientsService,
    private readonly authService: AuthService,
  ) {}

  @MessagePattern('get-clients')
  getAll(@Payload() params: ClientGetListDto) {
    return this.clientService.findMany(params);
  }

  @MessagePattern('get-client')
  async getOne(@Payload() id: number) {
    const client = await this.clientService.findOne(id);

    return [client];
  }

  @MessagePattern('create-client')
  post(@Payload() dto: ClientCreateDto) {
    console.log(dto);
    return this.clientService.create(dto);
  }

  @MessagePattern('edit-client')
  put(@Payload('id') id: number, @Payload('dto') dto: ClientUpdateDto) {
    return this.clientService.update(id, dto);
  }

  @MessagePattern('delete-client')
  remove(@Payload() id: number) {
    return this.clientService.remove(id);
  }

  @MessagePattern('login-client')
  login(@Payload() id: number) {
    return this.authService.signinById(id);
  }
}
