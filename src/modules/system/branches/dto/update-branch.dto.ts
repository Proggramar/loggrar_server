import { PartialType } from '@nestjs/swagger';
import { BranchCreateDto } from './create-branch.dto';

export class BranchUpdateDto extends PartialType(BranchCreateDto) {}
