import {  PartialType } from '@nestjs/swagger';
import { FiscalCreateDto } from './fiscal-create.dto';


export class FiscalUpdateDto extends PartialType(FiscalCreateDto) {}
