import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { TemplateBodyStart } from './template-body.entity';
import { AbstractEntity } from '@common/database';
import { SourceStart } from '@loggrar/account/start/source/entities/source.entity';
import { YesNo } from '@common/enums/yes-no.enum';

@Entity('account_template_header')
export class TemplateHeaderStart extends AbstractEntity {
  @Column('varchar', { unique: true, length: 4, nullable: false })
  code: string;

  @Column('varchar', { length: 50, nullable: false })
  name: string;

  @ManyToOne(() => SourceStart, (sourceStart) => sourceStart.id, { onDelete: 'NO ACTION', onUpdate: 'CASCADE', eager: true })
  @JoinColumn([{ name: 'id_source', referencedColumnName: 'id' }])
  source: SourceStart;

  @Column({ type: 'enum', enum: YesNo, default: YesNo.No })
  third: YesNo;

  @Column({ type: 'enum', enum: YesNo, default: YesNo.No })
  cost_center: YesNo;

  @Column({ type: 'enum', enum: YesNo, default: YesNo.No })
  assets: YesNo;

  @OneToMany(() => TemplateBodyStart, (templateBody) => templateBody.header, {
    cascade: ['insert', 'update'],
    onDelete: 'CASCADE',
    eager: true,
  })
  templateBody: TemplateBodyStart[];
}
