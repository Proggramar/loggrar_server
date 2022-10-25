import { ApiProperty, PartialType } from '@nestjs/swagger';
import { UnitCreateDto } from './create-unit.dto';

export class UnitUpdateDto extends PartialType(UnitCreateDto) {}
