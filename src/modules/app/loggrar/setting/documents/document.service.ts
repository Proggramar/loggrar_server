import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DbAbstract } from '@common/database';
import { DocumentSetting } from './entities/document.entity';

@Injectable()
export class DocumentService extends DbAbstract {
  constructor(
    @InjectRepository(DocumentSetting)
    private readonly documentRepository: Repository<DocumentSetting>,
  ) {
    super(documentRepository);
  }
}
