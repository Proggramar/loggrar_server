import { ApiProperty, PartialType } from '@nestjs/swagger';
import { DepartmentCreateDto } from './department-create.dto';

export class DepartmentUpdateDto extends PartialType(DepartmentCreateDto) {}
