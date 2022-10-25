import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CountryCreateDto {
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
}
