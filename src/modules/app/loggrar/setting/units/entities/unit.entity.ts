import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '@common/database';

@Entity('setting_units')
export class UnitSetting extends AbstractEntity {
  @Column('varchar', {
    unique: true,
    length: 10,
    nullable: false,
  })
  code: string;

  @Column('varchar', { length: 50, nullable: false })
  name: string;
}
