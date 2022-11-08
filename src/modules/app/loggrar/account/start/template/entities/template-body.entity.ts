import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '@common/database';
import { Accounts } from '@modules/app/loggrar/account/frequent/accounts/entities/accounts.entity';
import { TaxStart } from '@loggrar/account/start/tax/entities/tax.entity';
import { TransactionType } from '../enums/template.enum';
import { TemplateHeaderStart } from './template-header.entity';

@Entity('account_template_body')
export class TemplateBodyStart extends AbstractEntity {
  @ManyToOne(() => TemplateHeaderStart, (templateheader) => templateheader.id, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'id_header', referencedColumnName: 'id' }])
  header: TemplateHeaderStart;

  @ManyToOne(() => Accounts, (accounts) => accounts.id, { onDelete: 'NO ACTION', onUpdate: 'CASCADE', eager: true })
  @JoinColumn([{ name: 'id_account', referencedColumnName: 'id' }])
  account: Accounts;

  @Column({ type: 'enum', enum: TransactionType, default: TransactionType.debit })
  imputation: TransactionType;

  @ManyToOne(() => TaxStart, (tax) => tax.id, { onDelete: 'NO ACTION', onUpdate: 'CASCADE', eager: true })
  @JoinColumn([{ name: 'id_tax', referencedColumnName: 'id' }])
  tax: TaxStart;
}
