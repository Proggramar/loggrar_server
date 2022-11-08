import { AbstractEntity } from '@common/database';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('account_fiscal_periods')
export class FiscalProcess extends AbstractEntity {
  @Column('int')
  year: number;

  @Column('longtext')
  periods: JSON;
}
