import { Module } from '@nestjs/common';
import { MetaService } from './meta.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meta } from '../../entity/Meta';

@Module({
  imports: [TypeOrmModule.forFeature([Meta])],
  providers: [MetaService],
  exports: [MetaService],
})
export class MetaModule {}
