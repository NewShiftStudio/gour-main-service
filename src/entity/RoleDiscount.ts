import { Entity, Column, ManyToOne } from 'typeorm';
import { Base } from './Base';
import { ClientRole } from './ClientRole';
import { Product } from './Product';

@Entity()
export class RoleDiscount extends Base {
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
}
