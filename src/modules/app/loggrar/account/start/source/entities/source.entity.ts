import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '@common/database';
import { YesNo } from '@common/enums/yes-no.enum';
import { Enterprise } from '@system/enterprises/entities/enterprise.entity';

@Entity('account_sources')
export class SourceStart extends AbstractEntity {
  @Column('varchar', { unique: true, length: 4, nullable: false })
  code: string;

  @Column('varchar', { length: 50, nullable: false })
  name: string;

  @Column('varchar', { length: 10, nullable: false })
  prefix: string;

  @Column({ type: 'enum', enum: YesNo, default: YesNo.No })
  auto: YesNo;

  @Column('int', { unsigned: true, default: () => '0' })
  num_size: number;

  @Column('int', { unsigned: true, default: () => '0' })
  numeration: number;

  @Column({ type: 'enum', enum: YesNo, default: YesNo.No })
  printer: YesNo;

  @Column({ type: 'enum', enum: YesNo, default: YesNo.No })
  reference_document: YesNo;
}
