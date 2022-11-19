import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DbAbstract } from '@common/database';
import { CountrySetting } from './entities/country.entity';
import { CountryCreateDto } from './dto';
import { MyTools } from '@common/helpers/varius';

@Injectable()
export class CountryService extends DbAbstract {
  private readonly myTools = new MyTools();
  constructor(
    @InjectRepository(CountrySetting)
    private readonly countryRepository: Repository<CountrySetting>,
  ) {
    super(countryRepository);
  }

  async getCountriesData(): Promise<any> {
    const countriesFile: string = await this.myTools.getFileName('../../../seeds/data-to-seed/country-data.json');
    const countriesData: CountryCreateDto[] = await this.myTools.getDataFromFile(countriesFile);
    return countriesData;
  }

  async saveCountriesFromArray(countries: CountryCreateDto[]): Promise<CountrySetting[]> {
    let countriesSaved: CountrySetting[] = [];
    for await (const record of countries) {
      const countrySaved = (await this.create(record)) as CountrySetting;
      countriesSaved.push(countrySaved);
    }

    return countriesSaved;
  }

  async getCountryByCodeFromArray(countries: any, idCountry: string): Promise<CountryCreateDto> {
    const country: any = countries.filter((row) => row.code == idCountry);
    return country[0];
  }
}
