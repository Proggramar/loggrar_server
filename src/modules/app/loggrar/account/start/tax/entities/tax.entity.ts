import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Category, Types } from '../enum/tax.enum';
import { AbstractEntity } from '@common/database';
import { Accounts } from '@modules/app/loggrar/account/frequent/accounts/entities/accounts.entity';

@Entity('account_taxes')
export class TaxStart extends AbstractEntity {
  @Column('varchar', { unique: true, length: 3, nullable: false })
  code: string;

  @Column({ type: 'enum', enum: Category, default: Category.Tax })
  category: Category;

  @Column('varchar', { length: 50, nullable: false })
  name: string;

  @Column({ type: 'enum', enum: Types })
  type: Types;

  @Column({ type: 'decimal', unsigned: true, precision: 10, scale: 2, default: 0.0 })
  base: string;

  @Column({ type: 'decimal', unsigned: true, precision: 5, scale: 2, default: 0.0 })
  rate: string;

  @ManyToOne(() => Accounts, (accounts) => accounts.id, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn([{ name: 'id_sales', referencedColumnName: 'id' }])
  sales: Accounts;

  @ManyToOne(() => Accounts, (accounts) => accounts.id, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn([{ name: 'id_purchases', referencedColumnName: 'id' }])
  purchases: Accounts;

  @ManyToOne(() => Accounts, (accounts) => accounts.id, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn([{ name: 'id_refund_sales', referencedColumnName: 'id' }])
  refund_sales: Accounts;

  @ManyToOne(() => Accounts, (accounts) => accounts.id, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn([{ name: 'id_refund_purchases', referencedColumnName: 'id' }])
  refund_purchases: Accounts;
}
