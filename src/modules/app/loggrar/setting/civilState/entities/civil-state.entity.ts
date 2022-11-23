import { AbstractEntity } from '@common/database';
import { Column, Entity, Index } from 'typeorm';

@Entity('setting_civilstate')
export class CivilSetting extends AbstractEntity {
  @Index({ unique: true })
  @Column('varchar', { length: 2, nullable: false })
  code: string;

  @Column('varchar', { length: 50, nullable: false })
  name: string;
}
