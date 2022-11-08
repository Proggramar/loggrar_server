import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsJSON, IsNotEmpty, IsNumber } from 'class-validator';

export class FiscalCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly year: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsJSON()
  readonly periods?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  readonly is_acive: boolean;
}
