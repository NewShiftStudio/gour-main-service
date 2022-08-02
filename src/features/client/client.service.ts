import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Client } from '../../entity/Client';
import { getPaginationOptions } from '../../common/helpers/controllerHelpers';
import { ClientCreateDto } from './dto/сlient-create.dto';
import { ClientGetListDto } from './dto/сlient-get-list.dto';
import { ClientUpdateDto } from './dto/client-update.dto';
import { ClientRole } from '../../entity/ClientRole';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { Product } from '../../entity/Product';
import * as bcrypt from 'bcryptjs';
import { Image } from '../../entity/Image';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(ClientRole)
    private clientRoleRepository: Repository<ClientRole>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
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

  async getFavorites(id: number): Promise<Product[]> {
    const { favorites } = await this.clientRepository.findOne(id, {
      relations: ['favorites'],
    });

    return favorites;
  }

  async addToFavorites(clientId: number, productId: number) {
    const product = await this.productRepository.findOne(productId);

    if (!product) {
      throw new HttpException('Product was not found', 400);
    }

    const favorites = await this.getFavorites(clientId);

    return this.clientRepository.save({
      id: clientId,
      favorites: [...favorites, product],
    });
  }

  async removeFromFavorites(clientId: number, productId: number) {
    const favorites = await this.getFavorites(clientId);
    return this.clientRepository.save({
      id: clientId,
      favorites: favorites.filter((it) => it.id !== productId),
    });
  }

  async remove(id: number): Promise<void> {
    await this.clientRepository.softDelete(id);
  }

  async create(dto: ClientCreateDto) {
    const role = await this.clientRoleRepository.findOne(dto.roleId);

    if (!role) {
      throw new HttpException('Client role with this Id was not found', 400);
    }

    const foundUser = await this.clientRepository.findOne({
      phone: dto.phone,
    });

    if (foundUser) {
      throw new HttpException('User with this phone already exists', 400);
    }

    return this.clientRepository.save({
      roleId: dto.roleId,
      name: dto.name,
      phone: dto.phone,
      password: await this.getPasswordHash(dto.password),
    });
  }

  async update(id: number, dto: ClientUpdateDto) {
    let role: ClientRole | undefined;

    const client = await this.clientRepository.findOne(id);

    if (!client) {
      throw new HttpException('Client with this id was not found', 400);
    }

    const avatar = await this.imageRepository.findOne(dto.avatarId);

    // if (!avatar) {
    //   throw new HttpException('Image with this id was not found', 400);
    // }

    const updatedObj: DeepPartial<Client> = {
      ...client,
      firstName: dto.name || client.firstName,
      avatar: avatar || client.avatar,
      additionalInfo: {
        ...client.additionalInfo,
        ...(dto.additionalInfo || {}),
      },
    };

    if (dto.roleId) {
      updatedObj.role = await this.clientRoleRepository.findOne(dto.roleId);
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

  private getPasswordHash(password: string) {
    return bcrypt.hash(password, 5);
  }
}
