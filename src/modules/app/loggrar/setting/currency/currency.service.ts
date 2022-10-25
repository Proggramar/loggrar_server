import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DbAbstract } from '@common/database';
import { CurrencySetting } from './entities/currency.entity';

@Injectable()
export class CurrencyService extends DbAbstract {
  constructor(
    @InjectRepository(CurrencySetting)
    private readonly currencyRepository: Repository<CurrencySetting>,
  ) {
    super(currencyRepository);
  }
}
