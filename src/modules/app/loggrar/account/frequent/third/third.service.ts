import { DbAbstract } from '@common/database';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DocumentService } from '@loggrar/setting/documents/document.service';
import { MunicipalityService } from '@loggrar/setting/municipality/municipality.service';
import { Third } from './entities/third.entity';
import { Regime, Responsibility, Type } from './enums/third.enum';

@Injectable()
export class ThirdService extends DbAbstract {
  constructor(
    @InjectRepository(Third)
    private readonly thirdRepository: Repository<Third>,
    private readonly documentService: DocumentService,
    private readonly municipalityService: MunicipalityService,
  ) {
    super(thirdRepository);
  }
  async getListsData(): Promise<any> {
    const responsability = this.getResponsabilities();
    const types = this.getTypes();
    const regime = this.getRegimen();
    const documents = await this.getDocuments();
    const cities = await this.getCities();
    return { responsability, types, regime, documents, cities };
  }

  getResponsabilities() {
    let responsability: Array<string> = [];
    for (let value in Responsibility) {
      if (isNaN(Number(value))) responsability.push(Responsibility[value]);
    }
    return responsability;
  }

  getTypes() {
    let types: Array<string> = [];
    for (let value in Regime) {
      if (isNaN(Number(value))) types.push(Regime[value]);
    }
    return types;
  }

  getRegimen() {
    let regime: Array<string> = [];
    for (let value in Regime) {
      if (isNaN(Number(value))) regime.push(Regime[value]);
    }
    return regime;
  }

  async getDocuments() {
    const select = { id: true, name: true, type_document: true };
    const documents = await this.documentService.findAll({ select, throwError: false });
    return documents;
  }

  async getCities() {
    // TODO aplicar where por pais
    const selectMunicipality = { id: true, code: true, name: true };
    const citiesJoin = await this.municipalityService.findAll({ select: selectMunicipality, throwError: false });

    const cities = citiesJoin.map((item) => {
      return { id: item.id, code: item.code, name: item.name, department: item.id_department_join.name };
    });
    return cities;
  }
}
