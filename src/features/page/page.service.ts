import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Page } from '../../entity/Page';
import { getPaginationOptions } from '../../common/helpers/controllerHelpers';
import { BaseGetListDto } from '../../common/dto/base-get-list.dto';
import { PageCreateDto } from './dto/page-create.dto';
import { PageUpdateDto } from './dto/page-update.dto';
import { Image } from 'src/entity/Image';

@Injectable()
export class PageService {
  constructor(
    @InjectRepository(Page)
    private pageRepository: Repository<Page>,

    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
  ) {}

  findMany(params: BaseGetListDto) {
    return this.pageRepository.find({
      ...getPaginationOptions(params.offset, params.length),
    });
  }

  getOne(id: number) {
    return this.pageRepository.findOne({ id });
  }

  getOneByKey(key: string) {
    return this.pageRepository.findOne({ key });
  }

  async create({ bannerImg: bannerImgId, ...dto }: PageCreateDto) {
    let bannerImg: Image;

    if (bannerImgId) {
      bannerImg = await this.imageRepository.findOne(bannerImgId);

      if (!bannerImg)
        throw new NotFoundException(
          `Изображение с id=${bannerImgId} не найдено`,
        );
    }

    return this.pageRepository.save({ ...dto, bannerImg });
  }

  async update(id: number, { bannerImg: bannerImgId, ...dto }: PageUpdateDto) {
    let bannerImg: Image = null;

    if (bannerImgId) {
      bannerImg = await this.imageRepository.findOne(bannerImgId);

      if (!bannerImg)
        throw new NotFoundException(
          `Изображение с id=${bannerImgId} не найдено`,
        );
    }

    return this.pageRepository.save({
      id,
      bannerImg,
      ...dto,
    });
  }

  remove(id: number) {
    return this.pageRepository.softDelete(id);
  }
}
