import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '@safety/users/user.module';
import { PermissionModule } from '@safety/permissions/permission.module';

import { SourceService } from './source.service';
import { SourceController } from './source.controller';
import { SourceStart } from './entities/source.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SourceStart]), UserModule, PermissionModule],
  controllers: [SourceController],
  providers: [SourceService],
  exports: [SourceService],
})
export class SourceModule {}
