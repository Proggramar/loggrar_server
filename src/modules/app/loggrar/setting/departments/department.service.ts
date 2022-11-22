import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DbAbstract } from '@common/database';
import { MyTools } from '@common/helpers/varius';

import { DepartmentSetting } from './entities/department.entity';
import { DepartmentCreateDto } from './dto';

@Injectable()
export class DepartmentService extends DbAbstract {
  private readonly myTools = new MyTools();
  constructor(
    @InjectRepository(DepartmentSetting)
    private readonly departmentRepository: Repository<DepartmentSetting>,
  ) {
    super(departmentRepository);
  }

  async getDepartmentsData(country: string): Promise<any> {
    const departmentFile: string = await this.myTools.getFileName(`../../../seeds/data-to-seed/department-data-${country}.json`);
    const departmentData: DepartmentCreateDto[] = await this.myTools.getDataFromFile(departmentFile);
    return departmentData;
  }

  async saveDepartmentsFromArray(department: DepartmentCreateDto[], country: any) {
    for await (const record of department) {
      const departmentToSave = await this.myTools.mergeData(record, { country: country.id });
      await this.create(departmentToSave);
    }
  }
}
