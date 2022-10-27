import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DbAbstract } from '@common/database';
import { ReasonStart } from './entities/reason.entity';

@Injectable()
export class PayRollReasonService extends DbAbstract {
  constructor(
    @InjectRepository(ReasonStart)
    private readonly reasonRepository: Repository<ReasonStart>,
  ) {
    super(reasonRepository);
  }
}
