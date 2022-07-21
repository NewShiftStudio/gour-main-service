import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

import { PageService } from './page.service';
import { BaseGetListDto } from '../../common/dto/base-get-list.dto';
import { PageCreateDto } from './dto/page-create.dto';
import { PageUpdateDto } from './dto/page-update.dto';

@ApiTags('pages')
@Controller('pages')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @MessagePattern('get-pages')
  getAll(@Payload() params: BaseGetListDto) {
    return this.pageService.findMany(params);
  }

  @MessagePattern('get-page')
  getOne(@Payload() key: string) {
    return this.pageService.getOneByKey(key);
  }

  @MessagePattern('create-page')
  post(@Payload() dto: PageCreateDto) {
    return this.pageService.create(dto);
  }

  @MessagePattern('edit-page')
  put(@Payload('id') id: number, @Payload('dto') dto: PageUpdateDto) {
    return this.pageService.update(id, dto);
  }

  @MessagePattern('delete-page')
  remove(@Payload() id: number) {
    return this.pageService.remove(id);
  }
}
