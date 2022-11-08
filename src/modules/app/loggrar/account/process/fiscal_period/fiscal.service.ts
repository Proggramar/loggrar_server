import { DbAbstract } from '@common/database';
import { MyTools } from '@common/helpers/varius';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FiscalCreateDto } from './dto';
import { FiscalProcess } from './entities/fiscal.entity';

@Injectable()
export class FiscalService extends DbAbstract {
  private readonly myTools = new MyTools();
  constructor(
    @InjectRepository(FiscalProcess)
    private readonly fiscalRepository: Repository<FiscalProcess>,
  ) {
    super(fiscalRepository);
  }

  async fiscalCreate(body: FiscalCreateDto): Promise<FiscalProcess> {
    const year: number = body.year;
    let periods = [] as any;
    for (let i = 1; i <= 12; i++) {
      periods.push({
        month: i,
        name: await this.myTools.getMonthName(year, i),
        start: `${year}-${i}-01`,
        end: `${year}-${i}-` + (await this.myTools.getLastDayOfMonth(year, i)),
        is_active: true,
      });
    }

    periods.push({ month: 13, name: `Cierre fiscal: ${year}`, start: `${year}-12-31`, end: `${year}-12-31`, is_active: true });
    const recordToSave: FiscalCreateDto = (await this.myTools.mergeData(body, {
      periods: JSON.stringify(periods),
      is_active: true,
    })) as FiscalCreateDto;

    return (await this.create(recordToSave)) as FiscalProcess;
  }
}
