import { PartialType } from '@nestjs/swagger';
import { LanguageCreateDto } from './language-create.dto';

export class LanguageUpdateDto extends PartialType(LanguageCreateDto) {}
