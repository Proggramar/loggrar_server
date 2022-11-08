import { DbAbstract } from '@common/database';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TransactionsBodyFrequent } from './entities/transactions-body.entity';

@Injectable()
export class AccountTransactionsServiceSeating extends DbAbstract {
  constructor(
    @InjectRepository(TransactionsBodyFrequent)
    private readonly transactionsBodyRepository: Repository<TransactionsBodyFrequent>,
  ) {
    super(transactionsBodyRepository);
  }
}
