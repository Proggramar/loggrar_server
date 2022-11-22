import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DbAbstract } from '@common/database';
import { MyTools } from '@common/helpers/varius';

import { LanguageSetting } from './entities/Language.entity';
import { LanguageCreateDto } from './dto';

@Injectable()
export class LanguageService extends DbAbstract {
  private readonly myTools = new MyTools();
  constructor(
    @InjectRepository(LanguageSetting)
    private readonly LanguageRepository: Repository<LanguageSetting>,
  ) {
    super(LanguageRepository);
  }

  async getLanguageData(): Promise<any> {
    const languageFile: string = await this.myTools.getFileName(`../../../seeds/data-to-seed/language-data.json`);
    const languageData: LanguageCreateDto[] = await this.myTools.getDataFromFile(languageFile);
    return languageData;
  }

  async saveLanguageFromArray(language: LanguageCreateDto[]) {
    for await (const record of language) {
      await this.create(record);
    }
  }
}
