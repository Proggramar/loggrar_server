import { DbAbstract } from '@common/database';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UnitSetting } from './entities/unit.entity';

@Injectable()
export class UnitService extends DbAbstract {
  constructor(
    @InjectRepository(UnitSetting)
    private readonly unitRepository: Repository<UnitSetting>,
  ) {
    super(unitRepository);
  }
}
