import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '@common/database';
import { YesNo } from '@common/enums/yes-no.enum';

@Entity('payroll_reason')
export class ReasonStart extends AbstractEntity {
  @Column('varchar', { unique: true, length: 2, nullable: false })
  code: string;

  @Column('varchar', { length: 50, nullable: false })
  name: string;

  @Column({
    type: 'enum',
    enum: YesNo,
    default: YesNo.No,
  })
  compensation: YesNo;
}
