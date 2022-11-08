import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '@common/database';

import { TransactionsHeaderFrequent } from './transactions-header.entity';
import { Accounts } from '@loggrar/account/frequent/accounts/entities/accounts.entity';
import { CostcenterStart } from '@loggrar/account/start/cost_center/entities/costcenter.entity';
import { TaxStart } from '@loggrar/account/start/tax/entities/tax.entity';
import { Third } from '@loggrar/account/frequent/third/entities/third.entity';

@Entity('account_transaction_body')
export class TransactionsBodyFrequent extends AbstractEntity {
  @Column('int', { unsigned: true, nullable: false })
  record: number;

  @ManyToOne(() => TransactionsHeaderFrequent, (entityHeader) => entityHeader.id, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn([{ name: 'id_header', referencedColumnName: 'id' }])
  header: TransactionsHeaderFrequent;

  @ManyToOne(() => Accounts, (entityAccount) => entityAccount.id, { onDelete: 'NO ACTION', onUpdate: 'CASCADE' })
  @JoinColumn([{ name: 'id_account', referencedColumnName: 'id' }])
  account: Accounts;

  @Column('varchar', { length: 200, nullable: false })
  detail: string;

  @Column('varchar', { length: 30, nullable: false })
  supporting_document: string;

  @Column('decimal', { precision: 15, scale: 2, default: 0.0 })
  base_value: string;

  @Column('decimal', { precision: 15, scale: 2, default: 0.0 })
  debit: string;

  @Column('decimal', { precision: 15, scale: 2, default: 0.0 })
  credit: string;

  @ManyToOne(() => Third, (entityThird) => entityThird.id, { onDelete: 'NO ACTION', onUpdate: 'CASCADE', eager: true })
  @JoinColumn([{ name: 'id_third', referencedColumnName: 'id' }])
  third: Third;

  @ManyToOne(() => CostcenterStart, (entityCost) => entityCost.id, { onDelete: 'NO ACTION', onUpdate: 'CASCADE', eager: true })
  @JoinColumn([{ name: 'id_costcenter', referencedColumnName: 'id' }])
  costcenter: CostcenterStart;

  @ManyToOne(() => TaxStart, (entityTax) => entityTax.id, { onDelete: 'NO ACTION', onUpdate: 'CASCADE', eager: true })
  @JoinColumn([{ name: 'id_tax', referencedColumnName: 'id' }])
  tax: TaxStart;
}
