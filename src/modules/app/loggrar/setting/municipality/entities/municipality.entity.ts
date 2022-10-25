import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { DepartmentSetting } from '../../departments/entities/department.entity';
import { AbstractEntity } from '@common/database';

@Entity('setting_municipalities')
export class MunicipalitySetting extends AbstractEntity {
  @Column('varchar', { unique: true, length: 17, nullable: false })
  code: string;

  @Column('varchar', { length: 50, nullable: false })
  name: string;

  @ManyToOne(() => DepartmentSetting, (DepartmentSetting) => DepartmentSetting.id, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn([{ name: 'id_department', referencedColumnName: 'id' }])
  department: DepartmentSetting;
}
