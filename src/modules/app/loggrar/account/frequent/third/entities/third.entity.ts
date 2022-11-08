import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Expose } from 'class-transformer';

import { Responsibility, Type, Regime } from '../enums/third.enum';
import { AbstractEntity } from '@common/database';

import { DocumentSetting } from '@loggrar/setting/documents/entities/document.entity';
import { MunicipalitySetting } from '@loggrar/setting/municipality/entities/municipality.entity';

@Entity('account_thirds')
export class Third extends AbstractEntity {
  @Column('varchar', { unique: true, length: 15, nullable: false })
  identification: string;

  @Column('varchar', { length: 1, nullable: false })
  dv: string;

  @Column('varchar', { length: 30 })
  first_name: string;

  @Column('varchar', { length: 30, default: '' })
  middle_name: string;

  @Column('varchar', { length: 30 })
  last_name: string;

  @Column('varchar', { length: 30, default: '' })
  middle_last_name: string;

  @Column('varchar', { length: 200, default: '' })
  business_name: string;

  @Column('varchar', { length: 100, default: '' })
  address: string;

  @Column('longtext')
  phones: JSON;

  @Column('varchar', { length: 100, default: '' })
  billing_name: string;

  @Column('varchar', { length: 100, default: '' })
  billing_lastname: string;

  @Column('varchar', { length: 200, default: '' })
  billing_email: string;

  @Column('varchar', { length: 30, default: '' })
  billing_phone: string;

  @Column('varchar', { length: 10, default: '' })
  billing_postal: string;

  @Column({ type: 'enum', enum: Type, default: Type.Both })
  type: Type;

  @Column({ type: 'enum', enum: Regime, default: Regime.NI })
  regime: Regime;

  @Column({ type: 'enum', enum: Responsibility, default: Responsibility.R99 })
  responsability: Responsibility;

  @Expose()
  get name() {
    return `${this.first_name} ${this.middle_name} ${this.last_name} ${this.middle_last_name}`;
  }

  @ManyToOne(() => DocumentSetting, (entityDocument) => entityDocument.id, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn([{ name: 'id_document', referencedColumnName: 'id' }])
  document: DocumentSetting;

  @ManyToOne(() => MunicipalitySetting, (entityMunicipality) => entityMunicipality.id, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'id_city', referencedColumnName: 'id' }])
  city: MunicipalitySetting;
}
