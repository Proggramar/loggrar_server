import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '@common/database';

@Entity('setting_countries')
export class CountrySetting extends AbstractEntity {
  @Column('varchar', {
    unique: true,
    length: 5,
    nullable: false,
  })
  code: string;

  @Column('varchar', { length: 50, nullable: false })
  name: string;
}
