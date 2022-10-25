import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '@common/database';
import { TypeDocument } from '../enums/document.enum';

@Entity('setting_documents')
export class DocumentSetting extends AbstractEntity {
  @Index({ unique: true })
  @Column('varchar', { length: 50, nullable: false })
  name: string;

  @Column({
    type: 'enum',
    enum: TypeDocument,
    default: TypeDocument.Natural,
  })
  type_document: TypeDocument;

  @Column('varchar', { length: 5, nullable: false })
  dian_code: string;
}
