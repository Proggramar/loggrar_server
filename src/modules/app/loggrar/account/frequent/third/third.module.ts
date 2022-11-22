import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '@safety/users/user.module';
import { PermissionModule } from '@safety/permissions/permission.module';

import { Third } from './entities/third.entity';
import { ThirdService } from './third.service';
import { ThirdController } from './third.controller';
import { DocumentModule } from '@loggrar/setting/documents/document.module';
import { MunicipalityModule } from '@loggrar/setting/municipality/municipality.module';
import { DocumentSetting } from '@loggrar/setting/documents/entities/document.entity';
import { MunicipalitySetting } from '@loggrar/setting/municipality/entities/municipality.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Third, DocumentSetting, MunicipalitySetting]),
    UserModule,
    PermissionModule,
    DocumentModule,
    MunicipalityModule,
  ],
  controllers: [ThirdController],
  providers: [ThirdService],
  exports: [ThirdService],
})
export class ThirdModule {}
