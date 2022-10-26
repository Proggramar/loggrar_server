import { Module } from '@nestjs/common';

import { PayRollReasonModule } from '@loggrar/payroll/initiate/reasonDismissal/reason.module';

@Module({
  imports: [PayRollReasonModule],
  providers: [],
  exports: [],
})
export class LoggrarPayRollModules {}
