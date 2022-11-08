import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

import { YesNo } from '@common/enums/yes-no.enum';
import { TemplateBodyStart } from '../entities/template-body.entity';

export class TemplateCreateDTO {
  @ApiProperty()
  @IsOptional()
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
  @IsNumber()
  readonly id_source?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEnum(YesNo)
  readonly third?: YesNo;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEnum(YesNo)
  readonly cost_center?: YesNo;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEnum(YesNo)
  readonly assets?: YesNo;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  readonly is_active?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsArray()
  templateBody: TemplateBodyStart[];
}
