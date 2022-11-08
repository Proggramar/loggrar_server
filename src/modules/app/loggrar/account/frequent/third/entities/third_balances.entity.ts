import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '@common/database';
import { FiscalProcess } from '@loggrar/account/process/fiscal_period/entities/fiscal.entity';
import { Accounts } from '@loggrar/account/frequent/accounts/entities/accounts.entity';
import { Third } from './third.entity';

@Entity('account_thirds_balances')
export class AccountBalances extends AbstractEntity {
  @ManyToOne(() => FiscalProcess, (entityFiscal) => entityFiscal.id, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn([{ name: 'id_fiscal', referencedColumnName: 'id' }])
  fiscal: FiscalProcess;

  @ManyToOne(() => Accounts, (entityAccounts) => entityAccounts.id, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn([{ name: 'id_account', referencedColumnName: 'id' }])
  account: Accounts;

  @ManyToOne(() => Third, (entityThird) => entityThird.id, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn([{ name: 'id_third', referencedColumnName: 'id' }])
  third: Third;

  @Column('longtext')
  balances: JSON;
}
