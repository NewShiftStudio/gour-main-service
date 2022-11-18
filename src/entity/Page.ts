import { Column, Entity, ManyToOne } from 'typeorm';
import { PageMeta } from './PageMeta';
import { Base } from './Base';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Image } from './Image';
import { IsOptional } from 'class-validator';

@Entity()
export class Page extends Base {
  @ApiProperty({
    type: PageMeta,
  })
  @ManyToOne(() => PageMeta, {
    cascade: true,
    eager: true,
  })
  meta: PageMeta;

  @ApiProperty()
  @Column()
  key: string;

  @ApiProperty()
  @Column('json')
  info: Record<string, string | number>;

  @ApiPropertyOptional({
    type: Image,
  })
  @IsOptional()
  @ManyToOne(() => Image, {
    cascade: true,
    eager: true,
  })
  bannerImg?: Image;
}
