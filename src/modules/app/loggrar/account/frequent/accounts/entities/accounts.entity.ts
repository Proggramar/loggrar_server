import { BaseEntity, Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { Relation } from '../enums/accounts.enum';
import { YesNo } from '@common/enums/yes-no.enum';
import { AbstractEntity } from '@common/database';

@Entity('account_accounts')
export class Accounts extends AbstractEntity {
  @Column('varchar', { unique: true, length: 20, nullable: false })
  code: string;

  @Column('varchar', { length: 80, nullable: false })
  name: string;

  @Column('varchar', { length: 20, default: '' })
  code_father: string;

  @Column('varchar', { length: 36, default: '' })
  id_father: string;

  @Column({ type: 'enum', enum: Relation, default: Relation.No })
  relation: Relation;

  @Column({ type: 'enum', enum: YesNo, default: YesNo.Yes })
  transactional: YesNo;
}
