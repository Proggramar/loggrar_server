import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '@safety/users/user.module';
import { PermissionModule } from '@safety/permissions/permission.module';

import { PayRollReasonService } from './reason.service';
import { PayRollReasonController } from './reason.controller';
import { ReasonStart } from './entities/reason.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReasonStart]), UserModule, PermissionModule],
  controllers: [PayRollReasonController],
  providers: [PayRollReasonService],
  exports: [PayRollReasonService],
})
export class PayRollReasonModule {}
