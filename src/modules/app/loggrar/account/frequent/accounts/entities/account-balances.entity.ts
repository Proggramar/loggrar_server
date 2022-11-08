import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { AbstractEntity } from '@common/database';
import { FiscalProcess } from '@loggrar/account/process/fiscal_period/entities/fiscal.entity';
import { Accounts } from './accounts.entity';

@Entity('account_accounts_balances')
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

  @Column('longtext')
  balances: JSON;
}
