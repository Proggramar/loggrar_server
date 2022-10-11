import { PartialType } from '@nestjs/swagger';
import { EnterpriseCreateDto } from './create-enterprise.dto';

export class EnterpriseUpdateDto extends PartialType(EnterpriseCreateDto) {}
