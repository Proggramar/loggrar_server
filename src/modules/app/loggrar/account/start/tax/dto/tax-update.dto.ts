import { PartialType } from '@nestjs/swagger';
import { TaxCreateDto } from './tax-create.dto';

export class TaxUpdateDto extends PartialType(TaxCreateDto) {}
