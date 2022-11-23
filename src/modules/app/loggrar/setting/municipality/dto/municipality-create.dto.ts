import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class MunicipalityCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(12)
  readonly code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly department?: string;
}
