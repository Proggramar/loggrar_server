import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { YesNo } from '@common/enums/yes-no.enum';

export class ReasonCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(2)
  readonly code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEnum(YesNo)
  readonly compensation?: YesNo;
}
