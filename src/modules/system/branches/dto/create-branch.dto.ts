import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class BranchCreateDto {
  @ApiProperty({ example: '001', description: 'Branch code' })
  @IsNotEmpty()
  @MaxLength(20)
  @IsString()
  readonly code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  readonly address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  readonly phones: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  readonly locality: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(250)
  readonly email: string;

  @ApiProperty()
  @IsOptional()
  is_active?: boolean;
}
