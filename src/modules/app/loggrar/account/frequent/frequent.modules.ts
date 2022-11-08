import { Module } from '@nestjs/common';

import { AccountsModule } from './accounts/accounts.module';
import { ThirdModule } from './third/third.module';
import { TransactionsdModule } from './transactions/trsansactions.module';

@Module({
  imports: [AccountsModule, ThirdModule, TransactionsdModule],
  providers: [],
  exports: [],
})
export class LoggrarAccountFrequentModules {}
