import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class MyModuleCreateDto {
  @ApiProperty()
  readonly id_old?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  readonly name: string;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
  readonly component?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
  readonly route?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  readonly video_tutorial?: string;

  @ApiProperty()
  @IsString()
  readonly father_id?: string;

  @ApiProperty()
  @IsNumber()
  readonly menu_order?: number;
}
