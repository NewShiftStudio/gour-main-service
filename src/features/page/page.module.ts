import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PageService } from './page.service';
import { PageController } from './page.controller';
import { Page } from '../../entity/Page';
import { Image } from 'src/entity/Image';

@Module({
  imports: [TypeOrmModule.forFeature([Page, Image])],
  providers: [PageService],
  controllers: [PageController],
  exports: [PageService],
})
export class PageModule {}
