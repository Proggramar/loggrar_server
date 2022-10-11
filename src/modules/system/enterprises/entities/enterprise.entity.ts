import { Column, Entity, Index } from 'typeorm';
import { Exclude, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { Licences, Suscriptions } from '../enums';
import { AbstractEntity } from '@common/database';
import { DataBaseInformation, EnterpriseApplications } from '../types';

@Entity('system_enterprises')
export class Enterprise extends AbstractEntity {
  @ApiProperty({ example: '', description: 'Company tax ID  ' })
  @Index({ unique: true })
  @Column({ nullable: false })
  code: string;

  @ApiProperty({ example: '', description: 'Enterprise name' })
  @Column({ nullable: false })
  name: string;

  @ApiProperty({ example: '', description: 'Enterprise address' })
  @Column({ nullable: false })
  @Exclude()
  address: string;

  @ApiProperty({ example: '', description: 'Enterprise phones' })
  @Column({ nullable: false })
  @Exclude()
  phones: string;

  @ApiProperty({ example: '', description: 'Enterprise location' })
  @Column({ nullable: false })
  @Exclude()
  locality: string;

  @ApiProperty({ example: '', description: 'Enterprise slogan' })
  @Column({ nullable: false })
  @Exclude()
  slogan: string;

  @ApiProperty({ example: '', description: 'Enterprise email' })
  @Column({ nullable: false })
  @Exclude()
  email: string;

  @ApiProperty({ example: '', description: 'Enterprise logo id' })
  @Column({ nullable: true })
  @Exclude()
  logo: string;

  @ApiProperty({ example: '', description: 'Account parameters (JSON)' })
  @Column({ type: 'text' })
  params_account: string;

  @ApiProperty({ example: '', description: 'Enterprise license type' })
  @Column({
    type: 'enum',
    enum: Licences,
    default: Licences.Trial,
  })
  license: Licences;

  @ApiProperty({ example: '', description: 'Enterprise suscription type' })
  @Column({
    type: 'enum',
    enum: Suscriptions,
    default: Suscriptions.Monthly,
  })
  suscription: Suscriptions;

  @ApiProperty({ example: '', description: 'Enterprise suscription date' })
  @Type(() => Date)
  @Column({ type: 'varchar', length: 10, nullable: false })
  suscription_date: string;

  @ApiProperty({ example: '', description: 'Enterprise security token' })
  @Column({ type: 'text', nullable: false, default: '' })
  @Exclude()
  token: string;

  @ApiProperty({ example: '', description: 'Enterprise security token' })
  @Column({ length: 10, nullable: false, default: '' })
  @Exclude()
  pin_token: string;

  @ApiProperty({ example: '', description: 'Enterprise number of contracted branches' })
  @Column({ default: 1 })
  number_of_branches: number;

  @ApiProperty({ example: '', description: 'Enterprise names of branches' })
  @Column({ default: '' }) // Sucursal - Sede - Punto
  branchs_name: string;

  @ApiProperty({ example: '', description: 'Enterprise database information' })
  @Column({ type: 'text' })
  database_information: string;

  @ApiProperty({ example: '', description: 'Enterprise database information' })
  @Column({ type: 'text' })
  applications: string;
}
