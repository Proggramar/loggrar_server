import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository, Like, QueryResult } from 'typeorm';
import { validate } from 'uuid';

import { PaginatedResult } from '@common/interfaces';
import { TableLogger } from '@common/helpers/security';
import { ValidAcions } from '@safety/roles/enums';
import { isEmpty } from '@common/helpers/varius';

export interface GetRecordService {
  select?: object | null;
  where?: object | null;
  order?: object | null;
  relations?: object | null;
  page?: number | null;
  take?: number | null;
  throwError?: boolean | null;
}

export interface GetRecordByIdService {
  id: string;
  relations?: object | null;
  throwError?: boolean | null;
}

@Injectable()
export abstract class DbAbstract {
  protected constructor(protected readonly repository: Repository<any>) {}

  async all({ select = {}, where = {}, order = {}, relations = {} }: GetRecordService): Promise<any[]> {
    return await this.repository.find({ select, where, relations, order });
  }

  async paginate({
    select = {},
    where = {},
    order = {},
    relations = {},
    page = 1,
    take = 0,
  }: GetRecordService): Promise<PaginatedResult> {
    const [data, total] = await this.repository.findAndCount({
      select,
      where,
      order,
      relations,
      skip: (page - 1) * take,
      take,
    });

    return { data, meta: { total, page, last_page: Math.ceil(total / take) } };
  }

  async findAll({ select = {}, where = {}, order = {}, relations = {}, throwError = true }: GetRecordService): Promise<any[]> {
    const data = await this.all({ select, where, order, relations });
    if (throwError && !data) throw new NotFoundException('no records found');
    return data;
  }

  async findOneById({ id, relations = {}, throwError = true }: GetRecordByIdService): Promise<any> {
    return this.findOne({ where: { id }, relations, throwError });
  }

  async findOne({ where = {}, relations = {}, throwError = true }: GetRecordService): Promise<any> {
    // let toFind: object = { where };
    // if (!isEmpty(relations)) toFind = { ...toFind, relations };

    const data = await this.repository.find({ where, relations });

    if (throwError && (!data || data.length < 1)) throw new NotFoundException('Data with id: #${id} not found');
    if (data.length > 0) return data[0];
    return undefined;
  }

  async create(data: object): Promise<object> {
    try {
      return await this.repository.save(data);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async update(id: string, dataToUpdate: object): Promise<object> {
    const recordSaved = await this.findOne({ where: { id }, throwError: false });

    if (!recordSaved) throw new NotFoundException(`Record #${id} does not found for update`);

    try {
      return await this.repository.update(id, dataToUpdate);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(condition: object): Promise<object> {
    const recordSaved = await this.findOne(condition);

    try {
      return await this.repository.remove(recordSaved);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  // TODO  refactorizar
  async getDataGrid(queryParams: any) {
    const { sortBy, descending, page, columns, nativeFilters = '', relations = [] } = queryParams;
    const rowsPerPage = queryParams.rowsPerPage == 'Todos' ? 0 : queryParams.rowsPerPage;

    let start = (page - 1) * rowsPerPage;
    let filterFromClient = !isEmpty(queryParams.filter) ? String(queryParams.filter).toLowerCase() : '';
    let filterForm = '';
    let filterFormAnd = '';
    let query = this.repository.createQueryBuilder();
    let select: string = '';
    // let isSearch = 'No';
    // if (filterFromClient != '') isSearch = 'Si';
    //.leftJoinAndSelect('group.persons', 'persons')

    for (const col of columns) {
      // if (!isEmpty(col['fromdual']) && col['fromdual']) {
      //   if (!isEmpty(col['field'])) colsDual.push(col['field']);
      // } else {
      if (!(!isEmpty(col['fromdual']) && col['fromdual'])) {
        if (!isEmpty(col['filterFieldData'])) {
          if (!isEmpty(col['field'])) {
            // TODO : refactorizar
            filterForm += filterFormAnd + col['field'] + col['filterFieldDataOperador'] + col['filterFieldData'];
            filterFormAnd = ' and ';
          }
        } else {
          if (select.length > 0) select += ', ';
          select += col['field'];
          if (filterFromClient != '') {
            if (!isEmpty(col['filter']) && col['filter'] == true) {
              query.orWhere(`${col['field']} like(:seek)`, { seek: `%${filterFromClient}%` });
            }
          }
        }
      }
    }

    // if (filterForm !== '') {
    //   isSearch = 'Si';
    //   if (filter !== '') {
    //     filter = filterForm + ' and (' + filter + ')';
    //   } else {
    //     filter = filterForm;
    //   }
    // }

    // // const colsRaw = cols.join();

    // if (nativeFilters !== '') {
    //   if (filter !== '') {
    //     filter = nativeFilters + ' and (' + filter + ')';
    //   } else {
    //     filter = nativeFilters;
    //   }
    // }

    query.select(select);
    query.skip(start);
    query.take(rowsPerPage);

    if (sortBy) {
      if (!Array.isArray(sortBy)) {
        query.addOrderBy(sortBy, descending ? 'DESC' : 'ASC');
      }

      if (Array.isArray(sortBy)) {
        sortBy.map((col, idx) => {
          query.addOrderBy(col, descending[idx] ? 'DESC' : 'ASC');
        });
      }
    }

    // TODO
    // const sql = query.getSql();
    let [sql, params] = query.getQueryAndParameters();
    console.log(sql.split('ORDER')[0]);
    console.log(params);

    //     let [sql, params] = query.getQueryAndParameters();
    // params.forEach((value) => {
    //   if (typeof value === 'string') {
    //     sql = sql.replace('?', `"${value}"`);
    //   }
    //   if (typeof value === 'object') {
    //     if (Array.isArray(value)) {
    //       sql = sql.replace(
    //         '?',
    //         value.map((element) => (typeof element === 'string' ? `"${element}"` : element)).join(','),
    //       );
    //     } else {
    //       sql = sql.replace('?', value);
    //     }
    //   }
    //   if (['number', 'boolean'].includes(typeof value)) {
    //     sql = sql.replace('?', value.toString());
    //   }
    // });
    const data: any[] = await query.getRawMany();

    // const [data, total] = await this.repository.findAndCount({
    //   take: rowsPerPage, **************
    //   skip: start, **********
    //   select: cols, ************
    //   where, &&&
    //   relations,
    //   order: orderedBy, *********
    // });

    return {
      data,
      meta: {
        total: data.length,
        page,
        rowsPerPage,
      },
    };
  }

  private handleDBExceptions(error: any) {
    if (error.code == '11000') throw new ConflictException('Duplicate entry');
    const myTableLogger = new TableLogger();

    myTableLogger.logProcess(ValidAcions.error, 'exception', '', `${error.code} - ${error.message}`);
    throw new InternalServerErrorException('Unexpected error, check server table logs');
  }
}
