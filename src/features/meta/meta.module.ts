import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Meta } from '../../entity/Meta';
import { MetaService } from './meta.service';

@Module({
  imports: [TypeOrmModule.forFeature([Meta])],
  providers: [MetaService],
  exports: [MetaService],
})
export class MetaModule {}
