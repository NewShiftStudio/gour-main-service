import { Entity, Column, ManyToOne } from 'typeorm';
import { AppEntity } from './AppEntity';
import { ClientRole } from './ClientRole';
import { Product } from './Product';

@Entity()
export class RoleDiscount extends AppEntity {
  @ManyToOne(() => Product, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @ManyToOne(() => ClientRole, {
    eager: true,
  })
  role: ClientRole;

  @Column({
    type: 'float',
    nullable: true,
  })
  value: number;

  @Column({
    type: 'float',
    nullable: true,
  })
  rub: number;

  @Column({
    type: 'float',
    nullable: true,
  })
  eur: number;
}
