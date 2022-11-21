import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReverseSeedersController } from './reverse-seeders.controller';
import { ReverseSeedersService } from './reverse-seeders.service';
import { MyModuleModule } from '@safety/app-modules/module.module';
import { CountryModule } from '@loggrar/setting/country/country.module';
import { AccountsModule } from '@loggrar/account/frequent/accounts/accounts.module';

@Module({
  imports: [MyModuleModule, CountryModule, AccountsModule],
  controllers: [ReverseSeedersController],
  providers: [ReverseSeedersService],
  exports: [ReverseSeedersService],
})
export class ReverseSeedersModule {}
