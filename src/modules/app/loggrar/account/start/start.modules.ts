import { Module } from '@nestjs/common';

import { SourceModule } from './source/source.module';
import { CostcenterModule } from './cost_center/costcenter.module';
import { TaxModule } from './tax/tax.module';
import { TemplateModule } from './template/template.module';

@Module({
  imports: [SourceModule, CostcenterModule, TaxModule, TemplateModule],
  providers: [],
  exports: [],
})
export class LoggrarAccountStartModules {}
