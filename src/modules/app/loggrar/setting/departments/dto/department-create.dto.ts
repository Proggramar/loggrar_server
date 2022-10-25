import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class DepartmentCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(11)
  readonly code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly country?: string;
}
