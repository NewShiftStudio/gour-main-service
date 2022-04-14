import { Module } from '@nestjs/common';
import { PageService } from './page.service';
import { PageController } from './page.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from '../../entity/Page';

@Module({
  imports: [TypeOrmModule.forFeature([Page])],
  providers: [PageService],
  controllers: [PageController],
  exports: [PageService],
})
export class PageModule {}
