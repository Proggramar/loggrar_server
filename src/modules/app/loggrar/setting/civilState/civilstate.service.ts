import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DbAbstract } from '@common/database';
import { MyTools } from '@common/helpers/varius';

import { CivilCreateDto } from './dto';
import { CivilSetting } from './entities/civilstate.entity';

@Injectable()
export class CivilService extends DbAbstract {
  private readonly myTools = new MyTools();
  constructor(
    @InjectRepository(CivilSetting)
    private readonly civilRepository: Repository<CivilSetting>,
  ) {
    super(civilRepository);
  }

  async getCivilData(country: string): Promise<any> {
    const civilFile: string = await this.myTools.getFileName(`../../../seeds/data-to-seed/civil-state-data-${country}.json`);
    const civilData: CivilCreateDto[] = await this.myTools.getDataFromFile(civilFile);
    return civilData;
  }

  async saveCivilFromArray(civil: CivilCreateDto[]) {
    for await (const record of civil) {
      await this.create(record);
    }
  }
}
