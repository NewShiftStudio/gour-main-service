import { Column, Entity, ManyToOne } from 'typeorm';
import { PageMeta } from './PageMeta';
import { AppEntity } from './AppEntity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Page extends AppEntity {
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
