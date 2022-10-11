import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PermissionModule } from '@safety/permissions/permission.module';
import { UserModule } from '@safety/users/user.module';
import { UserBranchesModule } from '@safety/users-branches/user-branches.module';
import { Rol } from './entities/rol.entity';
import { RolController } from './rol.controller';
import { RolService } from './rol.service';

@Module({
  imports: [TypeOrmModule.forFeature([Rol]), UserModule, PermissionModule],
  controllers: [RolController],
  providers: [RolService],
  exports: [RolService],
})
export class RolModule {}
