import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Meta {
  @PrimaryColumn({
    unique: true,
  })
  key: string;

  @Column({
    type: 'text',
  })
  value: string;
}
