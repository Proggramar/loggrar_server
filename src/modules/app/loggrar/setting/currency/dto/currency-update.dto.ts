import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CurrencyCreateDto } from './currency-create.dto';

export class CurrencyUpdateDto extends PartialType(CurrencyCreateDto) {}
