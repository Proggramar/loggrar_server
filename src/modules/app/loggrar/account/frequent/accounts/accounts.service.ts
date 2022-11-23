import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, Not } from 'typeorm';

import { DbAbstract } from '@common/database';
import { YesNo } from '@common/enums/yes-no.enum';
import { MyTools } from '@common/helpers/varius';

import { Accounts } from './entities/accounts.entity';
import { Relation } from './enums/accounts.enum';
import { TransactionsBodyFrequent } from '@loggrar/account/frequent/transactions/entities/transactions-body.entity';
import { AccountTransactionsServiceSeating } from '@loggrar/account/frequent/transactions/transactions-body.service';
import { AccountsCreateDto } from './dto';

@Injectable()
export class AccountsService extends DbAbstract {
  private readonly myTools = new MyTools();
  constructor(
    @InjectRepository(Accounts)
    private readonly accountsRepository: Repository<Accounts>,
    private readonly dataSource: DataSource,
    private readonly transactionsServiceSeating: AccountTransactionsServiceSeating,
  ) {
    super(accountsRepository);
  }

  async getAccountsData(country: string): Promise<any> {
    const countriesAccountsFile: string = await this.myTools.getFileName(
      `../../../seeds/data-to-seed/accounts-data-${country}.json`,
    );
    const accounstData: AccountsCreateDto[] = await this.myTools.getDataFromFile(countriesAccountsFile);
    return accounstData;
  }

  async saveAccountsFromArray(accounts: AccountsCreateDto[]): Promise<void> {
    for await (const record of accounts) {
      await this.create(record);
    }
  }

  async updateIdFather() {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    let where: any = { code_father: Not('') };
    let select = { id: true, code_father: true };
    const accounts: any = await this.findAll({ select, where, throwError: false });
    let update: any;

    try {
      for await (const record of accounts) {
        where = { code: record.code_father };
        const father: any = await this.findOne({ where, throwError: false });
        where = { id: record.id };
        update = { id_father: father.id };
        await queryRunner.manager.update(Accounts, where, update);
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new NotFoundException('Error to update fathers accounts');
    } finally {
      await queryRunner.release();
    }
  }

  async getTypes(): Promise<object> {
    let account_relations: Array<string> = [];
    for (let value in Relation) {
      if (isNaN(Number(value))) {
        account_relations.push(Relation[value]);
      }
    }
    return { account_relations };
  }

  async checkAccount(code: string, code_father: string) {
    const seek = { code: code };
    let account = { exist: true, data: {} };
    let father = { exist: false, data: {} };

    const data = await this.findOne({ where: seek, throwError: false });

    if (!data) {
      account = { exist: false, data: {} };
      const seekFather = { code: code_father };
      const dataFather = await this.findOne({ where: seekFather, throwError: false });
      if (dataFather) {
        father = { exist: true, data: dataFather };
      }
    }
    return { account, father };
  }

  async canDeleteAccount(id: string) {
    let canDelete = false;
    let hasTransactions = false;
    let childrens = 0;
    let father = '';
    let seek = { id: id };

    const data = await this.findOne({ where: seek, throwError: false });

    if (data) {
      if (data.transactional == 'No') {
        // check children
        const children = await this.findOne({ where: { id_father: id }, throwError: false });
        if (!children) canDelete = true;
      } else {
        // check if has transactions
        const transactions = await this.transactionsServiceSeating.findOne({ where: { id_account: id }, throwError: false });
        if (!transactions) canDelete = true;
        else {
          hasTransactions = true;
        }
        // check if has sisters
        const sisters = await this.findAll({ where: { id_father: data.id_father }, throwError: false });
        childrens = sisters.length;
        if (childrens == 1) {
          canDelete = true;
          let seek = { id: data.id_father };
          const fatherData = await this.findOne({ where: seek, throwError: false });
          father = fatherData.name;
        }
      }
    }

    return { canDelete, hasTransactions, childrens, data, father };
  }

  async createAndMove(data: any): Promise<any> {
    this.saveAndMove(data);
  }

  async updateAndMove(id: string, data: any): Promise<any> {
    const recordSaved = await this.findOne({ where: { id } });
    this.saveAndMove({ ...recordSaved, ...data });
  }
  async saveAndMove(data: any): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();

    const moveTransactions = data.moveTransactions;
    delete data.moveTransactions;

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(Accounts, data);

      // update account father
      const idSource = data.id_father;
      let where: any = { id: idSource };
      const transactional = { transactional: YesNo.No };
      await queryRunner.manager.update(Accounts, where, transactional);

      if (moveTransactions) {
        // data to update transactions
        const idTarget = data.id;
        const account = new Accounts();
        account.id = idTarget;
        where = { id_account: idSource };
        await queryRunner.manager.update(TransactionsBodyFrequent, where, account);
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      throw new NotFoundException('Error to create account');
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  async deleteAndMove(id: string, moveTransactions: boolean, id_father: string, childrens: number): Promise<boolean> {
    let where: any = {};

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (moveTransactions) {
        // data to update transactions
        // const field = { account: id_father };
        const account = new Accounts();
        account.id = id_father;
        where = { account: id };
        await queryRunner.manager.update(TransactionsBodyFrequent, where, account);

        // account father now is transactional
        where = { id: id_father };
        const transactional = { transactional: YesNo.Yes };
        await queryRunner.manager.update(Accounts, where, transactional);
      } else {
        if (childrens == 1) {
          // now the father is transactional
          where = { id: id_father };
          const transactional = { transactional: YesNo.Yes };
          await queryRunner.manager.update(Accounts, where, transactional);
        }
      }

      // delete account
      where = { id: id };
      await queryRunner.manager.delete(Accounts, where);

      await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      throw new NotFoundException('Error to delete account');
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
    return true;
  }
}
