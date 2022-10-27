import { Module } from '@nestjs/common';

import { PayRollReasonModule } from '@loggrar/payroll/Start/reasonDismissal/reason.module';

@Module({
  imports: [PayRollReasonModule],
  providers: [],
  exports: [],
})
export class LoggrarPayRollModules {}
