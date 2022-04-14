import { Body, HttpException, Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Client } from '../../entity/Client';
import { getPaginationOptions } from '../../common/helpers/controllerHelpers';
import { ClientCreateDto } from './dto/ClientCreateDto';
import { ClientGetListDto } from './dto/ClientGetListDto';
import { ClientUpdateDto } from './dto/client.update.dto';
import { ClientRole } from '../../entity/ClientRole';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(ClientRole)
    private clientRoleRepository: Repository<ClientRole>,
  ) {}

  findMany(params: ClientGetListDto): Promise<[Client[], number]> {
    const options: FindManyOptions<Client> = {
      ...getPaginationOptions(params.offset, params.length),
    };
    if (params.isApproved !== undefined) {
      options.where = {
        isApproved: params.isApproved,
      };
    }

    if (params.roleId) {
      options.where = {
        ...((options.where as object) || {}),
        roleId: params.roleId,
      };
    }
    return this.clientRepository.findAndCount(options);
  }

  findOne(id: number): Promise<Client> {
    return this.clientRepository.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.clientRepository.softDelete(id);
  }

  async create(client: ClientCreateDto) {
    const role = await this.clientRepository.findOne(client.role);

    if (!role) {
      throw new HttpException('Client role with this Id was not found', 400);
    }

    const candidate = await this.clientRepository.findOne({
      apiUserUuid: client.apiUserUuid,
    });

    if (candidate) {
      throw new HttpException('Client with this UUID already exists', 400);
    }

    return this.clientRepository.save({
      ...client,
      role,
    });
  }

  async update(id: number, client: ClientUpdateDto) {
    let role: ClientRole | undefined;
    if (client.role) {
      role = await this.clientRoleRepository.findOne(client.role);
      if (!role) {
        throw new HttpException('Client role with this Id was not found', 400);
      }
    }

    return this.clientRepository.save({
      ...client,
      role,
      id,
    });
  }
}
