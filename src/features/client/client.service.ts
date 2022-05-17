import { Body, HttpException, Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Client } from '../../entity/Client';
import { getPaginationOptions } from '../../common/helpers/controllerHelpers';
import { ClientCreateDto } from './dto/ClientCreateDto';
import { ClientGetListDto } from './dto/ClientGetListDto';
import { ClientUpdateDto } from './dto/client.update.dto';
import { ClientRole } from '../../entity/ClientRole';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { Product } from '../../entity/Product';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(ClientRole)
    private clientRoleRepository: Repository<ClientRole>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
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

    // const candidate = await this.clientRepository.findOne({
    //   apiUserUuid: client.apiUserUuid,
    // });

    // if (candidate) {
    //   throw new HttpException('Client with this UUID already exists', 400);
    // }

    return this.clientRepository.save({
      ...client,
      role,
    });
  }

  async update(id: number, dto: ClientUpdateDto) {
    let role: ClientRole | undefined;

    const client = await this.clientRepository.findOne(id);
    if (!client) {
      throw new HttpException('Client with this id was not found', 400);
    }

    const updatedObj: DeepPartial<Client> = {
      name: dto.name,
      avatarId: dto.avatarId,
      additionalInfo: {
        ...client.additionalInfo,
        ...(dto.additionalInfo || {}),
      },
      id,
    };

    if (dto.role) {
      updatedObj.role = await this.clientRoleRepository.findOne(dto.role);
      if (!role) {
        throw new HttpException('Client role with this Id was not found', 400);
      }
    }

    if (dto.countries) {
      updatedObj.additionalInfo.countries = dto.countries;
    }

    if (dto.favoriteIds) {
      const favorites = [];
      for (const favoriteId of dto.favoriteIds) {
        favorites.push(await this.productRepository.findOne(favoriteId));
      }

      updatedObj.favorites = favorites;
    }

    return this.clientRepository.save(updatedObj);
  }

  updatePhone(id: number, phone: string) {
    return this.clientRepository.save({
      id,
      phone,
    });
  }
}
