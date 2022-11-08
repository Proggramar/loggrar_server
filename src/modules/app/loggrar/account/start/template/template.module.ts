import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '@safety/users/user.module';
import { PermissionModule } from '@safety/permissions/permission.module';

import { TemplateService } from './template.service';
import { TemplateController } from './template.controller';
import { TemplateHeaderStart } from './entities/template-header.entity';
import { TemplateBodyStart } from './entities/template-body.entity';
import { Accounts } from '@loggrar/account/frequent/accounts/entities/accounts.entity';
import { TaxStart } from '@loggrar/account/start/tax/entities/tax.entity';
import { AccountsModule } from '@loggrar/account/frequent/accounts/accounts.module';
import { TaxModule } from '@loggrar/account/start/tax/tax.module';
import { SourceModule } from '@loggrar/account/start/source/source.module';
import { SourceStart } from '@loggrar/account/start/source/entities/source.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TemplateHeaderStart, TemplateBodyStart, Accounts, SourceStart, TaxStart]),
    UserModule,
    PermissionModule,
    AccountsModule,
    TaxModule,
    SourceModule,
  ],
  controllers: [TemplateController],
  providers: [TemplateService],
  exports: [TemplateService],
})
export class TemplateModule {}
