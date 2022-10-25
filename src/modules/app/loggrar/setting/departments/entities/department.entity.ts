import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '@common/database';
import { CountrySetting } from '@modules/app/loggrar/setting/country/entities/country.entity';

@Entity('setting_departments')
@Index('deparments__enterprise_code', ['country', 'code'], {
  unique: true,
})
export class DepartmentSetting extends AbstractEntity {
  @Column('varchar', { length: 11, nullable: false })
  code: string;

  @Column('varchar', { length: 50, nullable: false })
  name: string;

  @ManyToOne(() => CountrySetting, (CountrySetting) => CountrySetting.id, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn([{ name: 'id_country', referencedColumnName: 'id' }])
  country: CountrySetting;
}
