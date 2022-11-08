import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { AccountsService } from '../../frequent/accounts/accounts.service';
import { SourceService } from '../source/source.service';
import { TaxService } from '../tax/tax.service';
import { DbAbstract } from '@common/database';
import { TemplateHeaderStart } from './entities/template-header.entity';
import { TemplateBodyStart } from './entities/template-body.entity';
import { TransactionType } from './enums/template.enum';

@Injectable()
export class TemplateService extends DbAbstract {
  constructor(
    @InjectRepository(TemplateHeaderStart)
    private readonly templateheader: Repository<TemplateHeaderStart>,
    private readonly accountsService: AccountsService,
    private readonly sourceService: SourceService,
    private readonly taxService: TaxService,
    private readonly dataSource: DataSource,
  ) {
    super(templateheader);
  }

  async getTypes() {
    let transactionsTypes: Array<string> = [];

    for (let value in TransactionType) if (isNaN(Number(value))) transactionsTypes.push(TransactionType[value]);

    return { transactionsTypes };
  }

  async getListsData(): Promise<any> {
    const { transactionsTypes } = await this.getTypes();
    const select = { id: true, code: true, name: true };
    const accounts = await this.accountsService.findAll({ select, throwError: false });
    const sources = await this.sourceService.findAll({ select, throwError: false });
    const taxes = await this.taxService.findAll({ select, throwError: false });
    return { accounts, sources, taxes, transactionsTypes };
  }

  async updateTemplate(id: number, body: any): Promise<any> {
    let where: any = {};
    let afefcted: number = 1;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // delete account of template
      where = { id_header: id };
      const { templateBody, ...data } = body;

      await queryRunner.manager.delete(TemplateBodyStart, where);
      await queryRunner.manager.update(TemplateHeaderStart, id, data);
      // blucle for save account of template
      templateBody.forEach(async (element) => {
        const record = { ...element, id_header: id };
        const data = new TemplateBodyStart();
        data.imputation = record.imputation;
        data.header = record.id_header;
        data.account = record.id_account;
        data.tax = record.id_tax;

        await queryRunner.manager.save(data);
      });

      await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors lets rollback the changes we made
      afefcted = 0;
      await queryRunner.rollbackTransaction();
      throw new NotFoundException('Error saving tamplate');
    } finally {
      // you need to release a queryRunner which was manually instantiated
      // await queryRunner.release();
    }
    return { affected: afefcted };
  }
}
