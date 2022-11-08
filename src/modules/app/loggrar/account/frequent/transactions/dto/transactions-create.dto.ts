import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { YesNo } from '@common/enums/yes-no.enum';
import { Relation } from '@loggrar/account/frequent/accounts/enums/accounts.enum';
import { TransactionsBodyFrequent } from '../entities/transactions-body.entity';

export class AccountsTransactionsCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  readonly code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(80)
  readonly name: string;

  // TODO revisar la utilidad de los 2 siguientes campos
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  readonly father: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly id_father?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEnum(Relation)
  readonly relation?: Relation;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEnum(YesNo)
  readonly transactional?: YesNo;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  readonly moveTransactions?: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  readonly seats: TransactionsBodyFrequent;
}
