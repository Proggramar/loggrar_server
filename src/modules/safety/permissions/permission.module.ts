import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Permissions } from './entities/permission.entity';
import { PermissionService } from './permission.service';

@Module({
  imports: [TypeOrmModule.forFeature([Permissions])],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
