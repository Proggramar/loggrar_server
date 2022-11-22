import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DbAbstract } from '@common/database';
import { MyTools } from '@common/helpers/varius';

import { MunicipalitySetting } from './entities/municipality.entity';
import { MunicipalityCreateDto } from './dto';
import { DepartmentService } from '../departments/department.service';

@Injectable()
export class MunicipalityService extends DbAbstract {
  private readonly myTools = new MyTools();
  constructor(
    @InjectRepository(MunicipalitySetting)
    private readonly municipalityRepository: Repository<MunicipalitySetting>,
    private readonly departmentService: DepartmentService,
  ) {
    super(municipalityRepository);
  }

  async getMunicipalitiesData(country: string): Promise<any> {
    const municipalitiesFile: string = await this.myTools.getFileName(
      `../../../seeds/data-to-seed/municipality-data-${country}.json`,
    );
    const municipalitiesData: MunicipalityCreateDto[] = await this.myTools.getDataFromFile(municipalitiesFile);
    return municipalitiesData;
  }

  async saveMunicipalitiesFromArray(municipalities: MunicipalityCreateDto[], country: any) {
    for await (const record of municipalities) {
      const where = { country: { id: country.id }, code: record.code.substring(0, 2) };
      const department: any = await this.departmentService.findOne({ where: where, throwError: false });
      const municipalityToSave = await this.myTools.mergeData(record, { department: department.id });
      await this.create(municipalityToSave);
    }
  }
}
