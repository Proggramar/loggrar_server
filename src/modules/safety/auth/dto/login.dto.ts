import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class UserCredentials {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(400)
  readonly user: string;

  @ApiProperty()
  @IsString()
  @MaxLength(400)
  readonly password: string;

  @ApiProperty()
  @IsString()
  @MaxLength(10)
  readonly otp: string;
}
