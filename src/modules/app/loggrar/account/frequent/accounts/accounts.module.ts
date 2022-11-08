import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '@safety/users/user.module';
import { PermissionModule } from '@safety/permissions/permission.module';

import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { Accounts } from './entities/accounts.entity';
import { TransactionsBodyFrequent } from '@loggrar/account/frequent/transactions/entities/transactions-body.entity';
import { TransactionsdModule } from '@loggrar/account/frequent/transactions/trsansactions.module';

@Module({
  imports: [TypeOrmModule.forFeature([Accounts, TransactionsBodyFrequent]), UserModule, PermissionModule, TransactionsdModule],
  controllers: [AccountsController],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}
