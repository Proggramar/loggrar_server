import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DbAbstract } from '@common/database';
import { DepartmentSetting } from './entities/department.entity';

@Injectable()
export class DepartmentService extends DbAbstract {
  constructor(
    @InjectRepository(DepartmentSetting)
    private readonly departmentRepository: Repository<DepartmentSetting>,
  ) {
    super(departmentRepository);
  }
}
