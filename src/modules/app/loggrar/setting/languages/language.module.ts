import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '@safety/users/user.module';
import { PermissionModule } from '@safety/permissions/permission.module';

import { LanguageSetting } from './entities/Language.entity';
import { LanguageService } from './Language.service';
import { LanguageController } from './Language.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LanguageSetting]), UserModule, PermissionModule],
  controllers: [LanguageController],
  providers: [LanguageService],
  exports: [LanguageService],
})
export class LanguageModule {}
