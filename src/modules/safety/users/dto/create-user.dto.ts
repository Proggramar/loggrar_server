import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UserCreateDto {
  @ApiProperty()
  @MaxLength(20)
  @IsString()
  readonly id?: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(5)
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
  @MaxLength(100)
  readonly password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly tenant: string;

  @ApiProperty()
  @IsBoolean()
  readonly is_active: boolean;
}
