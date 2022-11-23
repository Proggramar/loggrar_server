import { YesNo } from '@common/enums/yes-no.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { Relation } from '../enums/accounts.enum';

export class AccountsCreateDto {
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

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  readonly code_father: string;

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
}
