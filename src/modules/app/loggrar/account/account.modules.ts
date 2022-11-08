import { Module } from '@nestjs/common';

import { LoggrarAccountFrequentModules } from './frequent/frequent.modules';
import { LoggrarAccountProcessModules } from './process/process.modules';
import { LoggrarAccountReportModules } from './reports/reports.modules';
import { LoggrarAccountStartModules } from './start/start.modules';

@Module({
  imports: [LoggrarAccountFrequentModules, LoggrarAccountProcessModules, LoggrarAccountReportModules, LoggrarAccountStartModules],
  providers: [],
  exports: [],
})
export class LoggrarAccountModules {}
