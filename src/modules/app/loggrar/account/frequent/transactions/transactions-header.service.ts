import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection, DataSource } from 'typeorm';

import { months } from 'moment';
import { DbAbstract } from '@common/database';

import { TransactionsHeaderFrequent } from './entities/transactions-header.entity';
import { FiscalProcess } from '../../process/fiscal_period/entities/fiscal.entity';

@Injectable()
export class AccountTransactionsService extends DbAbstract {
  constructor(
    @InjectRepository(TransactionsHeaderFrequent)
    private readonly transactionsHeaderRepository: Repository<TransactionsHeaderFrequent>,
    private readonly dataSource: DataSource,
  ) {
    super(transactionsHeaderRepository);
  }
  async getListsData(): Promise<any> {
    let templates = await this.getTemplates();
    let periods = await this.getPeriods();

    return { templates, periods };
  }

  async getTemplates() {
    let templates = [];
    let where: any = { is_active: true };
    let select: any = {
      'th.id': true,
      'th.code': true,
      'th.name': true,
      'th.id_source': true,
      'sr.prefix': true,
      'sr.auto': true,
      'sr.reference_document': true,
      'sr.code': true,
      'sr.name': true,
      'sr.printer': true,
      'tb.imputation': true,
      'account.code': true,
      'account.name': true,
      'tx.code': true,
      'tx.name': true,
      'tx.category': true,
      'tx.type': true,
      'tx.base': true,
      'tx.rate': true,
    };
    try {
      let templatesQuery = this.dataSource
        .getRepository(TransactionsHeaderFrequent)
        .createQueryBuilder('th')
        .select(select)
        .leftJoin('th.templateBody', 'tb')
        .leftJoin('th.source', 'sr')
        .leftJoin('tb.account', 'account')
        .leftJoin('tb.taxn', 'tx')
        .where(where);

      templates = await templatesQuery.getMany();
    } catch (e) {
      console.error(e);
    }

    return templates;
  }
  async getPeriods() {
    let periods = [];
    let where: any = { is_active: true };
    let select: any = { 'f.id': true, 'f.year': true, 'f.periods': true };

    let periodsQuery = this.dataSource.getRepository(FiscalProcess).createQueryBuilder('f').select(select).where(where);

    const tempPeriods = await periodsQuery.getMany();
    if (tempPeriods.length > 0) {
      const year = new Date().getFullYear();

      tempPeriods.forEach((element) => {
        if (element.year <= year) {
          const monthSystem = new Date().getMonth() + 1;
          let months: Array<any> = JSON.parse(element.periods.toString());
          months.forEach((month) => {
            if (month.month < 13) {
              if (
                (element.year == year && month.month <= monthSystem && month.status == 'Activo') ||
                (element.year < year && month.status == 'Activo')
              ) {
                periods.push({
                  ...month,
                  id: element.id,
                  year: element.year,
                  fullName: `${month.name} - ${element.year}`,
                  monthId: `${element.id}-${month.month}`,
                });
              }
            }
          });
        }
      });
      periods = periods.slice().reverse();
    }
    return periods;
  }
  catch(e) {
    console.error(e);
  }
}

// let select = null;
// const templates = await this.templateService.find(
//   select,
//   where,
//   {},
//   [
//     'templateBody',
//     'templateBody.id_account_join',
//     'templateBody.id_tax_join',
//   ],
//   false,
// );

// tempPeriods.forEach((element) => {
//   if (element.year <= year) {
//     const monthSystem = new Date().getMonth() + 1;
//     let monthsActives: Array<any> = [];
//     let months: Array<any> = JSON.parse(element.periods.toString());
//     months.forEach((month) => {
//       if (month.month < 13) {
//         if (
//           (element.year == year &&
//             month.month <= monthSystem &&
//             month.status == 'Activo') ||
//           (element.year < year && month.status == 'Activo')
//         ) {

//           monthsActives.push(month);
//         }
//       }
//     });
//     periods.push({
//       id: element.id,
//       year: element.year,
//       periods: monthsActives.slice().reverse(),
//     });
//   }
// });
// periods = periods.slice().reverse();
