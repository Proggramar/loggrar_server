import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '@safety/users/user.module';
import { PermissionModule } from '@safety/permissions/permission.module';

import { ReasonService } from './reason.service';
import { ReasonController } from './reason.controller';
import { ReasonInitiate } from './entities/reason.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReasonInitiate]), UserModule, PermissionModule],
  controllers: [ReasonController],
  providers: [ReasonService],
  exports: [ReasonService],
})
export class PayRollReasonModule {}
