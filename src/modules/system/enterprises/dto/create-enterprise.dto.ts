import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsDateString,
  IsEnum,
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { Licences, Suscriptions } from '../enums';
import { DataBaseInformation, EnterpriseApplications } from '../types';

export class EnterpriseCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(20)
  @IsString()
  readonly code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  readonly address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  readonly phones: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  readonly locality: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  readonly slogan: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  readonly logo: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEnum(Licences)
  readonly license: Licences;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEnum(Suscriptions)
  readonly suscription: Suscriptions;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  suscription_date: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsJSON()
  readonly params_account: object;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly number_of_branches: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  branchs_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsJSON()
  database_information: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsJSON()
  applications?: string;

  @ApiProperty()
  @IsOptional()
  is_active?: boolean;

  @ApiProperty()
  @IsOptional()
  accounts_populate: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  country: string;
}
