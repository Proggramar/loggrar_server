import { AbstractEntity } from '@common/database';
import { YesNo } from '@common/enums/yes-no.enum';
import { Enterprise } from '@modules/system/enterprises/entities/enterprise.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('payroll_reason')
export class ReasonInitiate extends AbstractEntity {
  @Column('varchar', { unique: true, length: 2, nullable: false })
  code: string;

  @Column('varchar', { length: 50, nullable: false })
  name: string;

  @Column({
    type: 'enum',
    enum: YesNo,
    default: YesNo.No,
  })
  compensation: YesNo;

  @ManyToOne(() => Enterprise, (entityEnterprise) => entityEnterprise.id, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'id_enterprise', referencedColumnName: 'id' }])
  enterprise: Enterprise;
}
