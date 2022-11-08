import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { DbAbstract } from '@common/database';

import { AccountsService } from '@loggrar/account/frequent/accounts/accounts.service';
import { TaxStart } from './entities/tax.entity';
import { Category, Types } from './enum/tax.enum';

@Injectable()
export class TaxService extends DbAbstract {
  constructor(
    @InjectRepository(TaxStart)
    private readonly taxRepository: Repository<TaxStart>,
    private readonly accountsService: AccountsService,
  ) {
    super(taxRepository);
  }

  async getTypes() {
    const tax_category = this.getCategories();
    const tax_types = this.getTaxTypes();

    return { tax_category, tax_types };
  }

  async getAccounts(code: string): Promise<any> {
    const where = {
      code: Like(`${code}%`),
      transactional: 'Si',
    };
    const select = { id: true, code: true, name: true };
    return this.accountsService.findAll({ select, where, throwError: false });
  }

  getCategories() {
    let tax_category: Array<string> = [];
    for (let value in Category) {
      if (isNaN(Number(value))) tax_category.push(Category[value]);
    }
    return tax_category;
  }

  getTaxTypes() {
    let tax_types: Array<string> = [];
    for (let value in Types) {
      if (isNaN(Number(value))) tax_types.push(Types[value]);
    }
    return tax_types;
  }
}
