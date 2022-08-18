import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Page } from '../../entity/Page';
import { getPaginationOptions } from '../../common/helpers/controllerHelpers';
import { BaseGetListDto } from '../../common/dto/base-get-list.dto';
import { PageCreateDto } from './dto/page-create.dto';
import { PageUpdateDto } from './dto/page-update.dto';

@Injectable()
export class PageService {
  constructor(
    @InjectRepository(Page)
    private pageRepository: Repository<Page>,
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

  create(page: PageCreateDto) {
    return this.pageRepository.save(page);
  }

  update(id: number, page: PageUpdateDto) {
    return this.pageRepository.save({
      ...page,
      id,
    });
  }

  remove(id: number) {
    return this.pageRepository.softDelete(id);
  }
}
