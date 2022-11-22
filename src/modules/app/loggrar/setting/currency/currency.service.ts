import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DbAbstract } from '@common/database';
import { MyTools } from '@common/helpers/varius';

import { CurrencySetting } from './entities/currency.entity';
import { CurrencyCreateDto } from './dto';

@Injectable()
export class CurrencyService extends DbAbstract {
  private readonly myTools = new MyTools();
  constructor(
    @InjectRepository(CurrencySetting)
    private readonly currencyRepository: Repository<CurrencySetting>,
  ) {
    super(currencyRepository);
  }

  async getCurrencyData(): Promise<any> {
    const currencyFile: string = await this.myTools.getFileName(`../../../seeds/data-to-seed/currency-data.json`);
    const currencyData: CurrencyCreateDto[] = await this.myTools.getDataFromFile(currencyFile);
    return currencyData;
  }

  async saveCurrencyFromArray(currency: CurrencyCreateDto[]) {
    for await (const record of currency) {
      await this.create(record);
    }
  }
}
