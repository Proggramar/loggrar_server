import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DbAbstract } from '@common/database';
import { SourceStart } from './entities/source.entity';

@Injectable()
export class SourceService extends DbAbstract {
  constructor(
    @InjectRepository(SourceStart)
    private readonly sourceRepository: Repository<SourceStart>,
  ) {
    super(sourceRepository);
  }
}
