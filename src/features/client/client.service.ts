import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import * as bcrypt from 'bcryptjs';

import { Client } from '../../entity/Client';
import { getPaginationOptions } from '../../common/helpers/controllerHelpers';
import { ClientCreateDto } from './dto/сlient-create.dto';
import { ClientGetListDto } from './dto/сlient-get-list.dto';
import { ClientUpdateDto } from './dto/client-update.dto';
import { ClientRole } from '../../entity/ClientRole';
import { Product } from '../../entity/Product';
import { Image } from '../../entity/Image';
import { City } from '../../entity/City';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,

    @InjectRepository(ClientRole)
    private clientRoleRepository: Repository<ClientRole>,

    @InjectRepository(City)
    private cityRepository: Repository<City>,

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

    if (!product) throw new NotFoundException('Товар не найден');

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
    const user = await this.clientRepository.findOne({
      phone: dto.phone,
    });

    if (user)
      throw new BadRequestException(
        'Пользователь с таким телефоном уже существует',
      );

    const role = await this.clientRoleRepository.findOne(dto.roleId);

    if (!role) throw new NotFoundException('Роль не найдена');

    const city = await this.cityRepository.findOne(dto.cityId);

    if (!city) throw new NotFoundException('Город не найден');

    const password = await this.getPasswordHash(dto.password);

    return this.clientRepository.save({
      roleId: dto.roleId,
      city: dto.cityId,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
      password,
    });
  }

  async update(id: number, dto: ClientUpdateDto) {
    const client = await this.clientRepository.findOne(id);

    if (!client) throw new NotFoundException('Пользователь не найден');

    const avatar = await this.imageRepository.findOne(dto.avatarId);

    if (!avatar) throw new NotFoundException('Аватар не найден');

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
      const role = await this.clientRoleRepository.findOne(dto.roleId);

      if (!role) throw new NotFoundException('Роль не найдена');

      updatedObj.role = dto.roleId;
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
