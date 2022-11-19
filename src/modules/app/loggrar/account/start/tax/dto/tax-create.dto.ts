import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { Category, Types } from '../enum/tax.enum';

export class TaxCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEnum(Category)
  readonly category?: Category;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(3)
  readonly code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEnum(Types)
  readonly type: Types;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly base: String;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly rate: String;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly sales: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly purchases: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly refund_sales: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly refund_purchases: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  readonly is_active?: boolean;
}
