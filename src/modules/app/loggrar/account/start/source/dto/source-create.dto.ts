import { YesNo } from '@common/enums/yes-no.enum';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class SourceCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(4)
  readonly code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  readonly prefix: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEnum(YesNo)
  readonly auto?: YesNo;

  @ApiProperty()
  @IsNumber()
  readonly num_size?: Number;

  @ApiProperty()
  @IsNumber()
  readonly numeration?: Number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEnum(YesNo)
  readonly printer?: YesNo;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEnum(YesNo)
  readonly reference_document?: YesNo;
}
