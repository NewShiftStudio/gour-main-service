import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ClientRole } from '../../entity/ClientRole';
import { getPaginationOptions } from '../../common/helpers/controllerHelpers';
import { BaseGetListDto } from '../../common/dto/base-get-list.dto';
import { ClientRoleCreateDto } from './dto/client-role-create.dto';
import { ClientRoleUpdateDto } from './dto/client-role-update.dto';

@Injectable()
export class ClientRoleService {
  constructor(
    @InjectRepository(ClientRole)
    private clientRoleRepository: Repository<ClientRole>,
  ) {}

  findMany(params: BaseGetListDto) {
    return this.clientRoleRepository.findAndCount({
      ...getPaginationOptions(params.offset, params.length),
    });
  }

  getOne(id: number) {
    return this.clientRoleRepository.findOne({ id });
  }

  create(clientRole: ClientRoleCreateDto) {
    return this.clientRoleRepository.save(clientRole);
  }

  update(id: number, clientRole: ClientRoleUpdateDto) {
    return this.clientRoleRepository.save({
      ...clientRole,
      id,
    });
  }

  remove(id: number) {
    return this.clientRoleRepository.delete(id);
  }
}
