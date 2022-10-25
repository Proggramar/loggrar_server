import { Module } from '@nestjs/common';
import { LoggrarSettingModules } from '@loggrar/setting/setting.modules';

@Module({
  imports: [LoggrarSettingModules],
})
export class MyAppModules {}
