import { PartialType } from '@nestjs/swagger';
import { UserBranchesCreateDto } from './create-user-branches.dto';

export class UserBracnhesUpdateDto extends PartialType(UserBranchesCreateDto) {}
