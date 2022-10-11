import { Module } from '@nestjs/common';

import { AuthModule } from '@safety/auth/auth.module';
import { RolModule } from '@modules/safety/roles/rol.module';
import { MyModuleModule } from '@safety/app-modules/module.module';
import { UserBranchesModule } from '@safety/users-branches/user-branches.module';

@Module({
  imports: [AuthModule, RolModule, MyModuleModule, UserBranchesModule],
  providers: [],
  exports: [],
})
export class SafetyModules {}
