import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '@safety/users/user.module';
import { PermissionModule } from '@safety/permissions/permission.module';

import { MunicipalityService } from './municipality.service';
import { MunicipalityController } from './municipality.controller';
import { MunicipalitySetting } from './entities/municipality.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MunicipalitySetting]), UserModule, PermissionModule],
  controllers: [MunicipalityController],
  providers: [MunicipalityService],
  exports: [MunicipalityService],
})
export class MunicipalityModule {}
