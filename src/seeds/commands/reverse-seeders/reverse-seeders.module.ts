import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReverseSeedersController } from './reverse-seeders.controller';
import { ReverseSeedersService } from './reverse-seeders.service';
import { MyModuleModule } from '@safety/app-modules/module.module';
import { CountryModule } from '@loggrar/setting/country/country.module';
import { AccountsModule } from '@loggrar/account/frequent/accounts/accounts.module';
import { CivilModule } from '@loggrar/setting/civilState/civilstate.module';
import { CurrencyModule } from '@loggrar/setting/currency/currency.module';
import { DepartmentModule } from '@loggrar/setting/departments/department.module';
import { DocumentModule } from '@loggrar/setting/documents/document.module';
import { LanguageModule } from '@loggrar/setting/languages/language.module';
import { MunicipalityModule } from '@loggrar/setting/municipality/municipality.module';
import { PayRollReasonModule } from '@loggrar/payroll/Start/reasonDismissal/reason.module';
import { UnitModule } from '@loggrar/setting/units/unit.module';

@Module({
  imports: [
    MyModuleModule,
    CountryModule,
    AccountsModule,
    CivilModule,
    CountryModule,
    CurrencyModule,
    DepartmentModule,
    DocumentModule,
    LanguageModule,
    MunicipalityModule,
    PayRollReasonModule,
    UnitModule,
  ],
  controllers: [ReverseSeedersController],
  providers: [ReverseSeedersService],
  exports: [ReverseSeedersService],
})
export class ReverseSeedersModule {}
