import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DbAbstract } from '@common/database';
import { ReasonInitiate } from './entities/reason.entity';

@Injectable()
export class ReasonService extends DbAbstract {
  constructor(
    @InjectRepository(ReasonInitiate)
    private readonly reasonRepository: Repository<ReasonInitiate>,
  ) {
    super(reasonRepository);
  }
}
