import {
  ConflictException,
  HttpException,
  HttpStatus,
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

  async all({
    select = undefined,
    where = undefined,
    order = undefined,
    relations = undefined,
  }: GetRecordService): Promise<any[]> {
    return await this.repository.find({ select, where: where, relations, order });
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
      const updateResult = await this.repository.update(id, dataToUpdate);
      if (updateResult.affected && updateResult.affected > 0) return updateResult;
      throw new HttpException('Error updating data', HttpStatus.BAD_REQUEST);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(condition: object): Promise<object> {
    const recordSaved = await this.findOne(condition);

    try {
      const deleteResult = await this.repository.remove(recordSaved);
      if (deleteResult.affected && deleteResult.affected > 0) return deleteResult;
      throw new HttpException('Error deleting data', HttpStatus.BAD_REQUEST);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async getDataGrid(queryParams: any) {
    const { sortBy, descending, page, dataTableColumns, filterFromEndPoint = '', relations = [] } = queryParams;
    const rowsPerPage = queryParams.rowsPerPage == 'Todos' ? 0 : queryParams.rowsPerPage;
    let offset: number = (page - 1) * rowsPerPage;
    let toFilter: string = '';
    let filterPrev: string = '';
    let filterFromFieldFilterClient: string = !isEmpty(queryParams.filter) ? String(queryParams.filter).toLowerCase() : '';
    let filterStaticFromClient = '';
    let fieldsToSelect: string = '';
    let orderBy: string = '';
    let aliasMain: string = '';
    let toJoins: string = '';
    // const dataFilters: any[] = [];

    const tableName = this.repository.metadata.givenTableName;
    if (relations.length > 0) {
      aliasMain = tableName + '.';
    }
    // const dataFilters: Record<string, any> = {};
    // const  lab: { [k: string]: any } = {};
    if (filterFromFieldFilterClient !== '') await this.preventSQLInjection.checkSqlInjection(filterFromFieldFilterClient);

    const { fieldsSelect, filter } = await this.buildSelectAndFilter(
      dataTableColumns,
      aliasMain,
      filterFromFieldFilterClient,
      filterStaticFromClient,
    );
    fieldsToSelect = fieldsSelect;
    toFilter = filter;

    if (relations.length > 0) {
      const { joins, addSelects } = await this.buildRelation(tableName, relations);
      toJoins = joins;
      fieldsToSelect += ',' + addSelects;
    }

    if (filterStaticFromClient !== '') {
      if (toFilter !== '') filterPrev = ' and (' + toFilter + ')';
      toFilter = filterStaticFromClient + filterPrev;
    }

    if (filterFromEndPoint !== '') {
      if (toFilter !== '') filterPrev = ' and (' + toFilter + ')';
      toFilter = filterFromEndPoint + filterPrev;
    }

    if (sortBy) {
      if (!Array.isArray(sortBy) && sortBy !== '') {
        orderBy = aliasMain + sortBy + (descending ? ' DESC' : ' ASC');
      }

      if (Array.isArray(sortBy)) {
        sortBy.map((col, idx) => {
          if (orderBy != '') orderBy += ', ';
          orderBy = aliasMain + col + (descending[idx] ? ' DESC' : ' ASC');
        });
      }
    }
    if (orderBy !== '') orderBy = 'ORDER BY ' + orderBy;
    if (toFilter !== '') toFilter = 'where ' + filter;

    const sqlToExecute = `select ${fieldsToSelect} from ${tableName} ${toJoins}${toFilter} ${orderBy} LIMIT ${rowsPerPage} OFFSET ${offset}`;

    try {
      const data = await this.repository.query(sqlToExecute);
      return { data, meta: { total: data.length, page, rowsPerPage } };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private async buildRelation(tableName: string, relations: any): Promise<any> {
    let joins: string = '';
    let addSelects: string = '';
    for (const join of relations) {
      joins += `left join ${join.table} on ${tableName}.${join.fieldJoin} ${join.fieldComparation} ${join.table}.${join.fieldOrigin} `;
      const joinColumns = join.selectFields.split(',');
      for (const col of joinColumns) {
        if (addSelects.length > 0) addSelects += ', ';
        addSelects += `${join.table}.${col} as ${join.fieldAs}_${col}`;
      }
    }
    return { joins, addSelects };
  }

  private async buildSelectAndFilter(
    dataTableColumns: any,
    aliasMain: string,
    filterFromFieldFilterClient: string,
    filterStaticFromClient: string,
  ): Promise<any> {
    let fieldsSelect: string = '';
    let filter: string = '';
    for (const col of dataTableColumns) {
      if (!(!isEmpty(col['fromdual']) && col['fromdual'])) {
        if (!isEmpty(col['filterFieldData'])) {
          if (!isEmpty(col['field'])) {
            if (filterStaticFromClient != '') filterStaticFromClient += ' and ';
            await this.preventSQLInjection.checkSqlInjection(col['filterFieldData']);
            filterStaticFromClient += col['field'] + col['filterFieldDataOperador'] + col['filterFieldData'];
          }
        } else {
          if (fieldsSelect.length > 0) fieldsSelect += ', ';
          fieldsSelect += aliasMain + col['field'];
          if (filterFromFieldFilterClient != '') {
            if (!isEmpty(col['filter']) && col['filter'] == true) {
              if (filter !== '') filter += ' or ';
              filter += aliasMain + `${col['field']} like '%${filterFromFieldFilterClient}%' `;
            }
          }
        }
      }
    }
    return { fieldsSelect, filter, filterStaticFromClient };
  }

  private handleDBExceptions(error: any) {
    if (error.code == '11000') throw new ConflictException('Duplicate entry');
    const myTableLogger = new TableLogger();
    const message = process.env.NODE_ENV == 'dev' ? error.message : 'Unexpected error, check server logs table';

    myTableLogger.logProcess(ValidAcions.error, 'exception', '', `${error.code} - ${error.message}`);
    throw new InternalServerErrorException(message);
  }
}
