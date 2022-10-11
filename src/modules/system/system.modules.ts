import { Module } from '@nestjs/common';

import { BranchModule } from '@system/branches/branch.module';
import { EnterpriseModule } from '@system/enterprises/enterprise.module';
import { FavoriteModule } from './menu/favorite.module';

@Module({
  imports: [BranchModule, EnterpriseModule, FavoriteModule],
})
export class SystemModules {}
