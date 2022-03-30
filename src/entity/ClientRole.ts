import { Entity, Column, Index } from 'typeorm';
import { AppEntity } from './AppEntity';

@Entity()
export class ClientRole extends AppEntity {
  @Column()
  title: string;

  @Index({ unique: true })
  @Column()
  key: string;
}

export type IClientRoles = ClientRole;
