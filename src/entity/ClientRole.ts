import { Entity, Column, Index } from 'typeorm';
import { Base } from './Base';

@Entity()
export class ClientRole extends Base {
  @Column()
  title: string;

  @Index({ unique: true })
  @Column()
  key: string;
}

export type IClientRoles = ClientRole;
