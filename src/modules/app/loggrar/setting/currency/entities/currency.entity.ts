import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '@common/database';

@Entity('setting_currency')
export class CurrencySetting extends AbstractEntity {
  @Column('varchar', { unique: true, length: 5, nullable: false })
  code: string;

  @Column('varchar', { length: 50, nullable: false })
  name: string;

  @Column('varchar', { length: 5, nullable: false, default: '' })
  sign: string;

  @Column('varchar', {
    length: 5,
    nullable: false,
    default: '',
  })
  tribute_code: string;

  @Column('int', {
    unsigned: true,
    default: () => '0',
  })
  decimals: number;
}
