import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PermissionModule } from '@modules/safety/permissions/permission.module';
import { UserModule } from '@modules/safety/users/user.module';

import { TransactionsBodyFrequent } from './entities/transactions-body.entity';
import { TransactionsHeaderFrequent } from './entities/transactions-header.entity';
import { AccountTransactionsService } from './transactions-header.service';
import { AccountTransactionsController } from './transactions.controller';
import { AccountTransactionsServiceSeating } from './transactions-body.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionsHeaderFrequent, TransactionsBodyFrequent]), UserModule, PermissionModule],
  controllers: [AccountTransactionsController],
  providers: [AccountTransactionsService, AccountTransactionsServiceSeating],
  exports: [AccountTransactionsService, AccountTransactionsServiceSeating],
})
export class TransactionsdModule {}
