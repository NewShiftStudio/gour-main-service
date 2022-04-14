import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PageService } from './page.service';
import { BaseGetListDto } from '../../common/dto/BaseGetListDto';
import { PageCreateDto } from './dto/page.create.dto';
import { PageUpdateDto } from './dto/page.update.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Page } from '../../entity/Page';

@ApiTags('pages')
@Controller()
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @ApiResponse({
    type: [Page],
  })
  @Get('/pages')
  getAll(@Query() params: BaseGetListDto): Promise<Page[]> {
    return this.pageService.findMany(params);
  }

  @ApiResponse({
    type: Page,
  })
  @Get('/pages/:id')
  getOne(@Param('id') id: string) {
    return this.pageService.getOne(+id);
  }

  @ApiResponse({
    type: Page,
  })
  @Post('/pages')
  async post(@Body() page: PageCreateDto) {
    return this.pageService.create(page);
  }

  @ApiResponse({
    type: Page,
  })
  @Put('/pages/:id')
  put(@Param('id') id: string, @Body() page: PageUpdateDto) {
    return this.pageService.update(+id, page);
  }

  @Delete('/pages/:id')
  remove(@Param('id') id: string) {
    return this.pageService.remove(+id);
  }
}
