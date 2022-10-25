import { DbAbstract } from '@common/database';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CivilSetting } from './entities/civilstate.entity';

@Injectable()
export class CivilService extends DbAbstract {
  constructor(
    @InjectRepository(CivilSetting)
    private readonly civilRepository: Repository<CivilSetting>,
  ) {
    super(civilRepository);
  }
}
