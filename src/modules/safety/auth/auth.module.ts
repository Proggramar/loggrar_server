import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LogsSecurity } from '@safety/logs/log.entity';
import { EnterpriseModule } from '@system/enterprises/enterprise.module';
import { UserBranchesModule } from '@safety/users-branches/user-branches.module';
import { BranchModule } from '@system/branches/branch.module';
import { RolModule } from '@safety/roles/rol.module';
import { MyModuleModule } from '@safety/app-modules/module.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LogsSecurity]),
    EnterpriseModule,
    UserBranchesModule,
    BranchModule,
    RolModule,
    MyModuleModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
