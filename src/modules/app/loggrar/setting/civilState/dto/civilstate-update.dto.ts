import { PartialType } from '@nestjs/swagger';
import { CivilCreateDto } from './civilstate-create.dto';

export class CivilUpdateDto extends PartialType(CivilCreateDto) {}
