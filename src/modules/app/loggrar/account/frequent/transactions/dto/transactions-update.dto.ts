import { PartialType } from '@nestjs/swagger';
import { AccountsTransactionsCreateDto } from './transactions-create.dto';

export class AccountsTransactionsUpdateDto extends PartialType(AccountsTransactionsCreateDto) {}
