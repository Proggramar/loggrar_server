import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppStartController } from './app-start.controller';
import { AppStartService } from './app-start.service';
import { EnterpriseModule } from '@system/enterprises/enterprise.module';
import { RolModule } from '@modules/safety/roles/rol.module';
import { MyModuleModule } from '@safety/app-modules/module.module';
import { PermissionModule } from '@safety/permissions/permission.module';
import { UserModule } from '@modules/safety/users/user.module';
import { UserBranchesModule } from '@safety/users-branches/user-branches.module';
import { BranchModule } from '@system/branches/branch.module';
import { CountryModule } from '@loggrar/setting/country/country.module';
import { AccountsModule } from '@loggrar/account/frequent/accounts/accounts.module';
import { CivilModule } from '@loggrar/setting/civilState/civilstate.module';
import { CurrencyModule } from '@modules/app/loggrar/setting/currency/currency.module';
import { DepartmentModule } from '@modules/app/loggrar/setting/departments/department.module';
import { DocumentModule } from '@loggrar/setting/documents/document.module';
import { LanguageModule } from '@loggrar/setting/languages/language.module';
import { UnitModule } from '@loggrar/setting/units/unit.module';
import { PayRollReasonModule } from '@loggrar/payroll/Start/reasonDismissal/reason.module';
import { MunicipalityModule } from '@loggrar/setting/municipality/municipality.module';

@Module({
  imports: [
    EnterpriseModule,
    BranchModule,
    RolModule,
    MyModuleModule,
    PermissionModule,
    UserModule,
    UserBranchesModule,
    CountryModule,
    AccountsModule,
    CivilModule,
    CurrencyModule,
    DepartmentModule,
    MunicipalityModule,
    DocumentModule,
    LanguageModule,
    UnitModule,
    PayRollReasonModule,
  ],
  controllers: [AppStartController],
  providers: [AppStartService],
  exports: [AppStartService],
})
export class AppStartModule {}
