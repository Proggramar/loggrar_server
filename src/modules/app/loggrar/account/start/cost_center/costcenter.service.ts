import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DbAbstract } from '@common/database';
import { CostcenterStart } from './entities/costcenter.entity';

@Injectable()
export class CostcenterService extends DbAbstract {
  constructor(
    @InjectRepository(CostcenterStart)
    private readonly costcenterRepository: Repository<CostcenterStart>,
  ) {
    super(costcenterRepository);
  }
}
