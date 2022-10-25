import { PartialType } from '@nestjs/swagger';
import { MunicipalityCreateDto } from './municipality-create.dto';

export class MunicipalityUpdateDto extends PartialType(MunicipalityCreateDto) {}
