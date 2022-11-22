import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DbAbstract } from '@common/database';
import { MyTools } from '@common/helpers/varius';

import { UnitSetting } from './entities/unit.entity';
import { UnitCreateDto } from './dto';

@Injectable()
export class UnitService extends DbAbstract {
  private readonly myTools = new MyTools();
  constructor(
    @InjectRepository(UnitSetting)
    private readonly unitRepository: Repository<UnitSetting>,
  ) {
    super(unitRepository);
  }
  async getUnitData(): Promise<any> {
    const unitFile: string = await this.myTools.getFileName(`../../../seeds/data-to-seed/unit-data.json`);
    const unitData: UnitCreateDto[] = await this.myTools.getDataFromFile(unitFile);
    return unitData;
  }

  async saveUnitFromArray(unit: UnitCreateDto[]) {
    for await (const record of unit) {
      await this.create(record);
    }
  }
}
