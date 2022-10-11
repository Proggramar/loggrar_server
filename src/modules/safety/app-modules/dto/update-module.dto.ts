import { ApiProperty, PartialType } from '@nestjs/swagger';
import { MyModuleCreateDto } from './create-module.dto';

export class MyModuleUpdateDto extends PartialType(MyModuleCreateDto) {}
