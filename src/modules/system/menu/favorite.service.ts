import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DbAbstract } from '@common/database/database-abstact.service';
import { Favorite } from './entities/favorite.entity';

@Injectable()
export class FavoriteService extends DbAbstract {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
  ) {
    super(favoriteRepository);
  }

  async findFavorites(idUser: string): Promise<any> {
    const favorites = await this.findAll({ where: { user_id: idUser } });
    return favorites;
  }

  async removeFavorite(user_id: string, module_id: string): Promise<any> {
    return await this.remove({ user_id, module_id });
  }
}
