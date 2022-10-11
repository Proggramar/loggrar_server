import { ApiProperty, PartialType } from '@nestjs/swagger';
import { RolCreateDto } from './create-rol.dto';

export class RolUpdateDto extends PartialType(RolCreateDto) {}
