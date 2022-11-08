import { ApiProperty,  } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { Regime, Responsibility, Type } from '../enums/third.enum';

export class ThirdCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsAlphanumeric()
  @MaxLength(15)
  readonly identification?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsAlphanumeric()
  @MaxLength(1)
  readonly dv?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly id_document: Number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  readonly first_name?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(30)
  readonly middle_name?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  readonly last_name?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(30)
  readonly middle_last_name?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly id_city: Number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  readonly business_name: string;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  readonly address?: string;

  @ApiProperty()
  @IsString()
  readonly phones: JSON;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  readonly billing_name?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  readonly billing_lastname?: string;

  @ApiProperty()
  @IsEmail()
  @ValidateIf((e) => e.billing_email !== '')
  @MaxLength(200)
  readonly billing_email?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(30)
  readonly billing_phone?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(10)
  readonly billing_postal?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEnum(Responsibility)
  readonly responsability?: Responsibility;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEnum(Type)
  readonly type?: Type;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEnum(Regime)
  readonly regime?: Regime;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  readonly is_active?: boolean;
}

