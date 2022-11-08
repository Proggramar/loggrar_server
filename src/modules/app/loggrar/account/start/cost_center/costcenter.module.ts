import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '@safety/users/user.module';
import { PermissionModule } from '@safety/permissions/permission.module';

import { CostcenterService } from './costcenter.service';
import { CostcenterController } from './costcenter.controller';
import { CostcenterStart } from './entities/costcenter.entity';
import { CostCenterBalances } from './entities/cost-balances.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CostcenterStart, CostCenterBalances]), UserModule, PermissionModule],
  controllers: [CostcenterController],
  providers: [CostcenterService],
  exports: [CostcenterService],
})
export class CostcenterModule {}
