import { Column, Entity, ManyToOne } from 'typeorm';
import { PageMeta } from './PageMeta';
import { Base } from './Base';
import { ApiProperty } from '@nestjs/swagger';

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
}
