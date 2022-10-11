import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '@safety/users/user.module';
import { PermissionModule } from '@safety/permissions/permission.module';
import { Branch } from './entities/branch.entity';
import { BranchController } from './branch.controller';
import { BranchService } from './branch.service';

@Module({
  imports: [TypeOrmModule.forFeature([Branch]), UserModule, PermissionModule],
  controllers: [BranchController],
  providers: [BranchService],
  exports: [BranchService],
})
export class BranchModule {}
