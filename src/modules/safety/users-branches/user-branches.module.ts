import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserBranchesController } from './user-branches.controller';
import { UserBranchesService } from './user-branches.service';
import { UserBranches } from './entities/user-branches.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserBranches])],
  controllers: [UserBranchesController],
  providers: [UserBranchesService],
  exports: [UserBranchesService, TypeOrmModule],
})
export class UserBranchesModule {}
