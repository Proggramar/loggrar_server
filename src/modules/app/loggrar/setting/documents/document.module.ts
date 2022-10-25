import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { UserModule } from '@safety/users/user.module';
import { PermissionModule } from '@safety/permissions/permission.module';
import { DocumentSetting } from './entities/document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentSetting]), UserModule, PermissionModule],
  controllers: [DocumentController],
  providers: [DocumentService],
  exports: [DocumentService],
})
export class DocumentModule {}
