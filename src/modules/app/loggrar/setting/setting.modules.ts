import { Module } from '@nestjs/common';

import { CivilModule } from './civilState/civilstate.module';
import { CountryModule } from './country/country.module';
import { CurrencyModule } from './currency/currency.module';
import { DepartmentModule } from './departments/department.module';
import { DocumentModule } from './documents/document.module';
import { LanguageModule } from './languages/language.module';
import { MunicipalityModule } from './municipality/municipality.module';
import { UnitModule } from './units/unit.module';

@Module({
  imports: [
    CivilModule,
    CountryModule,
    CurrencyModule,
    DepartmentModule,
    DocumentModule,
    LanguageModule,
    MunicipalityModule,
    UnitModule,
  ],
  providers: [],
  exports: [],
})
export class LoggrarSettingModules {}
