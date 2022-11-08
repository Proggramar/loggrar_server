import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '@common/database';
import { YesNo } from '@common/enums/yes-no.enum';

@Entity('account_costcenter')
export class CostcenterStart extends AbstractEntity {
  @Column('varchar', { unique: true, length: 5, nullable: false })
  code: string;

  @Column('varchar', { length: 50, nullable: false })
  name: string;

  @Column({
    type: 'enum',
    enum: YesNo,
    default: YesNo.No,
  })
  father: YesNo;
}
