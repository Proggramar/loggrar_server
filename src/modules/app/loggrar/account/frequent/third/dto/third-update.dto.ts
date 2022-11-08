import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ThirdCreateDto } from './third-create.dto';

export class ThirdUpdateDto extends PartialType(ThirdCreateDto) {}
