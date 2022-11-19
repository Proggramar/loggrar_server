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
  ],
  controllers: [AppStartController],
  providers: [AppStartService],
  exports: [AppStartService],
})
export class AppStartModule {}
