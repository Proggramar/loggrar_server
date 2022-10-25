import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DbAbstract } from '@common/database';
import { CountrySetting } from './entities/country.entity';

@Injectable()
export class CountryService extends DbAbstract {
  constructor(
    @InjectRepository(CountrySetting)
    private readonly countryRepository: Repository<CountrySetting>,
  ) {
    super(countryRepository);
  }
}
