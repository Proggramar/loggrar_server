import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsJSON, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UserBranchesCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(20)
  @IsString()
  readonly user: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly branch: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly rol: string;
}
