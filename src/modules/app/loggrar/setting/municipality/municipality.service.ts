import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DbAbstract } from '@common/database';
import { MunicipalitySetting } from './entities/municipality.entity';

@Injectable()
export class MunicipalityService extends DbAbstract {
  constructor(
    @InjectRepository(MunicipalitySetting)
    private readonly municipalityRepository: Repository<MunicipalitySetting>,
  ) {
    super(municipalityRepository);
  }
}
