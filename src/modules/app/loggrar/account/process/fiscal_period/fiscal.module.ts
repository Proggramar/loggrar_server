import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '@safety/users/user.module';
import { PermissionModule } from '@safety/permissions/permission.module';

import { FiscalService } from './fiscal.service';
import { FiscalController } from './fiscal.controller';
import { FiscalProcess } from './entities/fiscal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FiscalProcess]), UserModule, PermissionModule],
  controllers: [FiscalController],
  providers: [FiscalService],
  exports: [FiscalService],
})
export class FiscalModule {}
