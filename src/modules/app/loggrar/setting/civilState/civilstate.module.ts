import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '@modules/safety/users/user.module';
import { PermissionModule } from '@modules/safety/permissions/permission.module';

import { CivilService } from './civilstate.service';
import { CivilController } from './civilstate.controller';
import { CivilSetting } from './entities/civil-state.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CivilSetting]), UserModule, PermissionModule],
  controllers: [CivilController],
  providers: [CivilService],
  exports: [CivilService],
})
export class CivilModule {}
