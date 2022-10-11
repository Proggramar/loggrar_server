import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MariaConfigService } from './mariadb.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: MariaConfigService,
    }),
  ],

  controllers: [],
  providers: [],
  exports: [],
})
export class ConnectionDatabaseModule {}
