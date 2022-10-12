import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UserCreateDto {
  @ApiProperty()
  @MaxLength(20)
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(200)
  @MinLength(10)
  @IsString()
  readonly user: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  readonly password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsBoolean()
  readonly is_active: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  readonly wizard: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly tenant?: string;
}
