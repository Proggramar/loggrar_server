import { DbAbstract } from '@common/database';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LanguageSetting } from './entities/Language.entity';

@Injectable()
export class LanguageService extends DbAbstract {
  constructor(
    @InjectRepository(LanguageSetting)
    private readonly LanguageRepository: Repository<LanguageSetting>,
  ) {
    super(LanguageRepository);
  }
}
