import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '@common/database';

import { Origin } from '../enums/transactions.enum';
import { User } from '@modules/safety/users/entities/user.entity';
import { FiscalProcess } from '@loggrar/account/process/fiscal_period/entities/fiscal.entity';
import { SourceStart } from '@loggrar/account/start/source/entities/source.entity';
import { Third } from '@loggrar/account/frequent/third/entities/third.entity';
import { TransactionsBodyFrequent } from './transactions-body.entity';

@Entity('account_transaction_header')
@Index('enterprise_source_document', ['source', 'document'], { unique: true })
export class TransactionsHeaderFrequent extends AbstractEntity {
  @ManyToOne(() => SourceStart, (entitySource) => entitySource.id, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn([{ name: 'id_source', referencedColumnName: 'id' }])
  source: SourceStart;

  @Column('varchar', { length: 20, nullable: false })
  document: string;

  @ManyToOne(() => FiscalProcess, (entityFiscal) => entityFiscal.id, { onDelete: 'NO ACTION', onUpdate: 'CASCADE', eager: true })
  @JoinColumn([{ name: 'id_fiscal', referencedColumnName: 'id' }])
  fiscal: FiscalProcess;

  @Column('int', { unsigned: true, nullable: false, comment: 'period number' })
  id_period: number;

  @Column('varchar', { length: 10, nullable: false })
  prefix: string;

  @Column('date', { nullable: false })
  date: string;

  @Column('varchar', { length: 200, nullable: false })
  detail: string;

  @Column('varchar', { length: 30, nullable: false, comment: '' })
  supporting_document: string;

  @Column({ type: 'enum', enum: Origin, default: Origin.account })
  origin: Origin;

  @ManyToOne(() => Third, (entityThird) => entityThird.id, { onDelete: 'NO ACTION', onUpdate: 'CASCADE', eager: true })
  @JoinColumn([{ name: 'id_third', referencedColumnName: 'id' }])
  third: Third;

  @OneToMany(() => TransactionsBodyFrequent, (transactionsBody) => transactionsBody.id, {
    cascade: ['insert', 'update'],
    onDelete: 'CASCADE',
    eager: true,
  })
  transactionsBody: TransactionsBodyFrequent[];

  @ManyToOne(() => User, (entityCreated) => entityCreated.id, { onDelete: 'NO ACTION', onUpdate: 'CASCADE', eager: true })
  @JoinColumn([{ name: 'id_user_created', referencedColumnName: 'id' }])
  user_created: User;

  @ManyToOne(() => User, (entityUpdated) => entityUpdated.id, { onDelete: 'NO ACTION', onUpdate: 'CASCADE', eager: true })
  @JoinColumn([{ name: 'id_user_updated', referencedColumnName: 'id' }])
  user_updated: User;
}
