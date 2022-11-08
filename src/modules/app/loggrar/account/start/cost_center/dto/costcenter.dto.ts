import { PartialType } from '@nestjs/swagger';
import { CostcenterCreateDto } from './cost-center-create.dto';

export class CostcenterUpdateDto extends PartialType(CostcenterCreateDto) {}
