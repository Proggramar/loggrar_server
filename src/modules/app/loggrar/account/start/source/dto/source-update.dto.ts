import { PartialType } from '@nestjs/swagger';
import { SourceCreateDto } from './source-create.dto';

export class SourceUpdateDto extends PartialType(SourceCreateDto) {}
