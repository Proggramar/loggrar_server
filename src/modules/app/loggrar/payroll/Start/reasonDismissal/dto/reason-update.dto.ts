import { PartialType } from '@nestjs/swagger';
import { ReasonCreateDto } from './reason-create.dto';

export class ReasonUpdateDto extends PartialType(ReasonCreateDto) {}
