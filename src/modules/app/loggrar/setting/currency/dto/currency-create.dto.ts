import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CurrencyCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(5)
  readonly code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  readonly name: string;
  @ApiProperty()
  @IsString()
  @MaxLength(5)
  readonly sign?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(5)
  readonly tribute_code?: string;

  @ApiProperty()
  @IsNumber()
  readonly decimals?: Number;
}
