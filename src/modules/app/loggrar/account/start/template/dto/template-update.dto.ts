import { PartialType } from '@nestjs/swagger';
import { TemplateCreateDTO } from './template-create.dto';

export class TemplateUpdateDTO extends PartialType(TemplateCreateDTO) {}
