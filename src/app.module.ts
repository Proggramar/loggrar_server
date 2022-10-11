import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConnectionDatabaseModule } from 'config/core/mariadb-connection/mariadb.module';
import { CoreSecurityModule } from 'config/core/core-.security.module';

import { SafetyModules } from '@safety/safety.modules';
import { SystemModules } from '@system/system.modules';
import { MyAppModules } from '@modules/app/my-app.module';
import { SeedsModules } from 'seeds/seeds.modules';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    ConnectionDatabaseModule,
    CoreSecurityModule,
    SafetyModules,
    SystemModules,
    MyAppModules,
    SeedsModules,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
