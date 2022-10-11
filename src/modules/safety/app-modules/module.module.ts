import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleController } from './module.controller';
import { MyModule } from './entities/my-module.entity';
import { MyModuleService } from './module.service';
import { PermissionModule } from '@safety/permissions/permission.module';
import { UserModule } from '@safety/users/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([MyModule]), UserModule, PermissionModule],
  controllers: [ModuleController],
  providers: [MyModuleService],
  exports: [MyModuleService],
})
export class MyModuleModule {}
