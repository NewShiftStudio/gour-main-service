import { Entity, Column, ManyToMany, ManyToOne, Index } from 'typeorm';
import { AppEntity } from './AppEntity';
import { ClientRole } from './ClientRole';
import { Product } from './Product';

@Entity()
export class Client extends AppEntity {
  @Column({
    type: 'uuid',
  })
  @Index({
    unique: true,
  })
  apiUserUuid: string;

  @ManyToOne(() => ClientRole, {
    eager: true,
  })
  role: ClientRole;

  @Column({
    default: false,
  })
  isApproved: boolean;

  @Column({
    type: 'json',
    default: '{}',
  })
  additionalInfo: Record<string, string | number>;

  @ManyToMany(() => Product)
  favorites: Product[];
}

export type IClient = Client;
