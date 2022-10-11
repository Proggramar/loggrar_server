import { PartialType } from '@nestjs/swagger';
import { FavoriteCreateDto } from './create-favorite.dto';

export class FavoriteUpdateDto extends PartialType(FavoriteCreateDto) {}
