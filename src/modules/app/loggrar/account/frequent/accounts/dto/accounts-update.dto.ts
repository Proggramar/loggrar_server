import { ApiProperty, PartialType } from '@nestjs/swagger';
import { AccountsCreateDto } from './accounts-create.dto';

export class AccountsUpdateDto extends PartialType(AccountsCreateDto) {}
