import { Module } from '@nestjs/common';
import { LoggrarSettingModules } from '@loggrar/setting/setting.modules';
import { LoggrarPayRollModules } from './loggrar/payroll/payroll.modules';
import { LoggrarAccountModules } from './loggrar/account/account.modules';

@Module({
  imports: [LoggrarSettingModules, LoggrarAccountModules, LoggrarPayRollModules],
})
export class MyAppModules {}
