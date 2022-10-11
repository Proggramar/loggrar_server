import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { MyTools } from '@common/helpers/varius';
import { Branch } from './entities/branch.entity';
import { DbAbstract } from '@common/database/database-abstact.service';
import { BranchCreateDto, BranchUpdateDto } from './dto';
import { Enterprise } from '@system/enterprises/entities/enterprise.entity';

@Injectable()
export class BranchService extends DbAbstract {
  private readonly myTools = new MyTools();
  constructor(
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    private readonly jwtService: JwtService,
  ) {
    super(branchRepository);
  }

  async createBranch(body: BranchCreateDto) {
    const token = await this.myTools.createExpireToken({ sub: body.code, data: { other: body.name } });

    const { ...dataToSave } = { ...body, token: token, audit: ['id', 'code', 'name'] };
    try {
      return await this.create(dataToSave);
    } catch (error) {
      // TODO refactorizar
      return {
        code: error.driverError.code,
        errno: error.driverError.errno,
        sqlState: error.driverError.sqlState,
        sqlMessage: error.driverError.sqlMessage,
      };
    }
  }

  async updateBranch(id: string, body: BranchUpdateDto) {
    return this.create({ id, ...body });
  }

  async checkBranchToken(branch: Branch) {
    const { sub, name } = this.jwtService.decode(branch.token) as any;

    if (sub !== branch.code || name !== branch.name) {
      throw new BadRequestException('Branch data was incorrectly modified..');
    }
  }

  async getBranchData(enterprise: Enterprise): Promise<BranchCreateDto> {
    const branchData: BranchCreateDto = {
      code: enterprise.code,
      name: enterprise.name,
      address: enterprise.address,
      phones: enterprise.phones,
      locality: enterprise.locality,
      email: enterprise.email,
      is_active: true,
    };
    return branchData;
  }
}
