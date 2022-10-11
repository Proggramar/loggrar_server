import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '@safety/users/user.module';
import { PermissionModule } from '@safety/permissions/permission.module';
import { Enterprise } from './entities/enterprise.entity';
import { EnterpriseController } from './enterprise.controller';
import { EnterpriseService } from './enterprise.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Enterprise]),
    UserModule,
    PermissionModule,
  ],
  controllers: [EnterpriseController],
  providers: [EnterpriseService],
  exports: [EnterpriseService],
})
export class EnterpriseModule {}
