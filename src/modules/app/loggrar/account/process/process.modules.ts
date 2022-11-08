import { Module } from '@nestjs/common';
import { FiscalModule } from './fiscal_period/fiscal.module';

@Module({
  imports: [FiscalModule],
  providers: [],
  exports: [],
})
export class LoggrarAccountProcessModules {}
