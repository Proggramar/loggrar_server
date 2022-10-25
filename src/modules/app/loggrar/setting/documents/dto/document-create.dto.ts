import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { TypeDocument } from '../enums/document.enum';

export class DocumentCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(5)
  readonly dian_code?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEnum(TypeDocument)
  readonly type_document?: TypeDocument;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  readonly is_active?: boolean;
}
