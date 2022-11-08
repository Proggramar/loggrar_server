import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '@safety/users/user.module';
import { PermissionModule } from '@safety/permissions/permission.module';

import { Third } from './entities/third.entity';
import { ThirdService } from './third.service';
import { ThirdController } from './third.controller';
import { DocumentService } from '@loggrar/setting/documents/document.service';
import { MunicipalityService } from '@loggrar/setting/municipality/municipality.service';
import { DocumentSetting } from '@loggrar/setting/documents/entities/document.entity';
import { MunicipalitySetting } from '@loggrar/setting/municipality/entities/municipality.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Third, DocumentSetting, MunicipalitySetting]), UserModule, PermissionModule],
  controllers: [ThirdController],
  providers: [ThirdService, DocumentService, MunicipalityService],
  exports: [ThirdService, DocumentService, MunicipalityService],
})
export class ThirdModule {}
