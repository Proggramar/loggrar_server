import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DbAbstract } from '@common/database';
import { MyTools } from '@common/helpers/varius';

import { ReasonStart } from './entities/reason.entity';
import { ReasonCreateDto } from './dto';

@Injectable()
export class PayRollReasonService extends DbAbstract {
  private readonly myTools = new MyTools();
  constructor(
    @InjectRepository(ReasonStart)
    private readonly reasonRepository: Repository<ReasonStart>,
  ) {
    super(reasonRepository);
  }

  async getReasonsData(country: string): Promise<any> {
    const reasonsFile: string = await this.myTools.getFileName(`../../../seeds/data-to-seed/reason-data-${country}.json`);
    const reasonsData: ReasonCreateDto[] = await this.myTools.getDataFromFile(reasonsFile);
    return reasonsData;
  }

  async saveReasonsFromArray(reasons: ReasonCreateDto[]) {
    for await (const record of reasons) {
      await this.create(record);
    }
  }
}
