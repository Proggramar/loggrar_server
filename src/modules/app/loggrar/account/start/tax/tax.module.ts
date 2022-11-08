import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '@safety/users/user.module';
import { PermissionModule } from '@safety/permissions/permission.module';

import { TaxService } from './tax.service';
import { TaxController } from './tax.controller';
import { TaxStart } from './entities/tax.entity';
import { Accounts } from '@loggrar/account/frequent/accounts/entities/accounts.entity';
import { AccountsModule } from '@loggrar/account/frequent/accounts/accounts.module';

@Module({
  imports: [TypeOrmModule.forFeature([TaxStart, Accounts]), UserModule, PermissionModule, AccountsModule],
  controllers: [TaxController],
  providers: [TaxService],
  exports: [TaxService],
})
export class TaxModule {}
