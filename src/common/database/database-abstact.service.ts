import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository, Like, QueryResult } from 'typeorm';
import { validate } from 'uuid';

import { PaginatedResult } from '@common/interfaces';
import { MySecurity, TableLogger } from '@common/helpers/security';
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
  private readonly preventSQLInjection = new MySecurity();
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

    if (throwError && (!data || data.length < 1)) throw new NotFoundException(`Data with term(s) not found`);
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

  async getDataGrid(queryParams: any) {
    const { sortBy, descending, page, columns, filterFromEndPoint = '', relations = [] } = queryParams;

    const rowsPerPage = queryParams.rowsPerPage == 'Todos' ? 0 : queryParams.rowsPerPage;

    let offset: number = (page - 1) * rowsPerPage;
    let filter: string = '';
    let filterPrev: string = '';
    let filterFromFieldFilterClient: string = !isEmpty(queryParams.filter) ? String(queryParams.filter).toLowerCase() : '';
    let filterStaticFromClient = '';
    let select: string = '';
    let orderBy: string = '';
    const dataFilters: any[] = [];
    // const dataFilters: Record<string, any> = {};
    // const  lab: { [k: string]: any } = {};
    if (filterFromFieldFilterClient !== '') await this.preventSQLInjection.checkSqlInjection(filterFromFieldFilterClient);

    for (const col of columns) {
      if (!(!isEmpty(col['fromdual']) && col['fromdual'])) {
        if (!isEmpty(col['filterFieldData'])) {
          if (!isEmpty(col['field'])) {
            if (filterStaticFromClient != '') filterStaticFromClient += ' and ';
            await this.preventSQLInjection.checkSqlInjection(col['filterFieldData']);
            filterStaticFromClient += col['field'] + col['filterFieldDataOperador'] + col['filterFieldData'];
          }
        } else {
          if (select.length > 0) select += ', ';
          select += col['field'];
          if (filterFromFieldFilterClient != '') {
            if (!isEmpty(col['filter']) && col['filter'] == true) {
              if (filter !== '') filter += ' or ';
              filter += `${col['field']} like '%${filterFromFieldFilterClient}%' `;
            }
          }
        }
      }
    }

    if (filterStaticFromClient !== '') {
      if (filter !== '') filterPrev = ' and (' + filter + ')';
      filter = filterStaticFromClient + filterPrev;
    }

    if (filterFromEndPoint !== '') {
      if (filter !== '') filterPrev = ' and (' + filter + ')';
      filter = filterFromEndPoint + filterPrev;
    }

    if (sortBy) {
      if (!Array.isArray(sortBy) && sortBy !== '') {
        orderBy = sortBy + (descending ? ' DESC' : ' ASC');
      }

      if (Array.isArray(sortBy)) {
        sortBy.map((col, idx) => {
          if (orderBy != '') orderBy += ', ';
          orderBy = col + (descending[idx] ? ' DESC' : ' ASC');
        });
      }
    }
    if (orderBy !== '') orderBy = 'ORDER BY ' + orderBy;
    if (filter !== '') filter = 'where ' + filter;
    const tableName = this.repository.metadata.givenTableName;
    const sqlToExecute = `select ${select} from ${tableName} ${filter} ${orderBy} LIMIT ${rowsPerPage} OFFSET ${offset}`;

    try {
      const data = await this.repository.query(sqlToExecute);

      return { data, meta: { total: data.length, page, rowsPerPage } };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions(error: any) {
    if (error.code == '11000') throw new ConflictException('Duplicate entry');
    const myTableLogger = new TableLogger();

    myTableLogger.logProcess(ValidAcions.error, 'exception', '', `${error.code} - ${error.message}`);
    throw new InternalServerErrorException('Unexpected error, check server table logs');
  }
}
