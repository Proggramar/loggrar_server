import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DbAbstract } from '@common/database';
import { MyTools } from '@common/helpers/varius';

import { DocumentSetting } from './entities/document.entity';
import { DocumentCreateDto } from './dto';

@Injectable()
export class DocumentService extends DbAbstract {
  private readonly myTools = new MyTools();
  constructor(
    @InjectRepository(DocumentSetting)
    private readonly documentRepository: Repository<DocumentSetting>,
  ) {
    super(documentRepository);
  }

  async getDocumentsData(country: string): Promise<any> {
    const documentsFile: string = await this.myTools.getFileName(`../../../seeds/data-to-seed/document-data-${country}.json`);
    const documentsData: DocumentCreateDto[] = await this.myTools.getDataFromFile(documentsFile);
    return documentsData;
  }

  async saveDocumentsFromArray(documents: DocumentCreateDto[]) {
    for await (const record of documents) {
      await this.create(record);
    }
  }
}
