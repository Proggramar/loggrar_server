import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { ValidRoles } from '@safety/roles/enums';

export class RolCreateDto {
  @ApiProperty({ example: 'Super admin', description: 'Rol name' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  readonly name: string;

  @ApiProperty({ example: 'Super Admin', description: 'Rol type', enum: ValidRoles })
  @IsNotEmpty()
  @IsString()
  @IsEnum(ValidRoles)
  readonly rol_type: ValidRoles;

  @ApiProperty({ example: '0', description: 'Rol level' })
  @IsNotEmpty()
  @IsNumber()
  readonly level: number;
}
