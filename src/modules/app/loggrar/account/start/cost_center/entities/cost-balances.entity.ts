import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '@common/database';
import { CostcenterStart } from './costcenter.entity';
import { FiscalProcess } from '@modules/app/loggrar/account/process/fiscal_period/entities/fiscal.entity';

@Entity('account_cost_balances')
export class CostCenterBalances extends AbstractEntity {
  @Column('longtext')
  balances: JSON;

  @ManyToOne(() => CostcenterStart, (costcenterStart) => costcenterStart.id, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'id_cost_center', referencedColumnName: 'id' }])
  costCenter: CostcenterStart;

  @ManyToOne(() => FiscalProcess, (fiscalProcess) => fiscalProcess.id, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'id_fiscal', referencedColumnName: 'id' }])
  fiscal: FiscalProcess;
}
