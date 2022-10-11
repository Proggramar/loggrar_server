import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FavoriteCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly idModule?: number;
}
