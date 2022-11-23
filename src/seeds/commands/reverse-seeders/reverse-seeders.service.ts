import { Injectable, Logger } from '@nestjs/common';

import { MyTools } from '@common/helpers/varius';
import { IfileSeeder } from '@common/interfaces';
import { MyModuleService } from '@safety/app-modules/module.service';
import { CivilService } from '@loggrar/setting/civilState/civilstate.service';
import { CountryService } from '@loggrar/setting/country/country.service';
import { CurrencyService } from '@loggrar/setting/currency/currency.service';
import { DepartmentService } from '@loggrar/setting/departments/department.service';
import { DocumentService } from '@loggrar/setting/documents/document.service';
import { LanguageService } from '@loggrar/setting/languages/Language.service';
import { MunicipalityService } from '@loggrar/setting/municipality/municipality.service';
import { PayRollReasonService } from '@loggrar/payroll/Start/reasonDismissal/reason.service';
import { UnitService } from '@loggrar/setting/units/unit.service';
import { AccountsService } from '@loggrar/account/frequent/accounts/accounts.service';
import { SourceService } from '@loggrar/account/start/source/source.service';

@Injectable()
export class ReverseSeedersService {
  private readonly myTools = new MyTools();
  constructor(
    private readonly myAppModuleService: MyModuleService,
    private readonly accountsService: AccountsService,
    private readonly civilService: CivilService,
    private readonly countryService: CountryService,
    private readonly currencyService: CurrencyService,
    private readonly departmentService: DepartmentService,
    private readonly documentService: DocumentService,
    private readonly languageService: LanguageService,
    private readonly munipalityService: MunicipalityService,
    private readonly reasonService: PayRollReasonService,
    private readonly unitService: UnitService,
    private readonly sourceService: SourceService,
  ) {}

  async reverseSeeders() {
    const filesDataToReverse: string[] = [
      'my-module',
      'accounts&&&',
      'civil-state&&&',
      'country',
      'currency',
      'department&&&',
      'document&&&',
      'language',
      'municipality&&&',
      'reason&&&',
      'unit',
      'source&&&',
    ];
    let directory = await this.myTools.normalizeFile('../', 'seeds/data-to-seed', '');

    const filesToReversed: IfileSeeder[] = filesDataToReverse.map((file) => {
      const country = file.includes('&&&') ? '-CO' : '';
      let fileSeeder = { directory, file: file.replace('&&&', '') + `-data${country}.json`, className: '' };
      return fileSeeder;
    });

    directory = await this.myTools.normalizeFile('../', 'modules', '');
    let entitiesFiles: IfileSeeder[] = await this.myTools.listFiles(directory, 'entity.js', '.map', []);
    await this.myTools.readClass(entitiesFiles);
    directory = await this.myTools.normalizeFile('../../src/', 'seeds/data-to-seed', '');

    Logger.warn('Tables to reverse: ' + filesToReversed.length);

    for await (const file of filesToReversed) {
      let entity = await this.myTools.mathEntity(file.file.replace('-CO', ''), entitiesFiles);
      const fileName = file.file.split('.')[0];
      if (entity) {
        const fields = await this.myTools.retrieveFields(file);
        const dataFromTable = await this.getData(entity, fields);

        let dataToFile = dataFromTable;
        if (!fields.includes('id')) {
          dataToFile = dataFromTable.map((element) => {
            delete element.id;
            return element;
          });
        }
        Logger.log(`Retrieve: [ ${fileName} ] Records reversed: ` + dataFromTable.length + ' ...');
        this.myTools.saveFile(directory + '/' + file.file, JSON.stringify(dataToFile));
        Logger.log(`Saved: [ ${fileName} ]`);
      } else {
        Logger.error(`Retrieve: [  ${fileName}  ] Not math entity ...`);
      }
    }
    Logger.warn('Reverse finished.');
  }
  async getData(entity: string, fields: string[]): Promise<any> {
    const select = await this.formSelect(fields);
    if (entity == 'MyModule') return this.myAppModuleService.all({ select });
    if (entity == 'Accounts') return this.accountsService.all({ select, order: { code: true } });
    if (entity == 'CivilSetting') return this.civilService.all({ select, order: { code: true } });
    if (entity == 'CountrySetting') return this.countryService.all({ select, order: { code: true } });
    if (entity == 'CurrencySetting') return this.currencyService.all({ select, order: { code: true } });
    if (entity == 'DepartmentSetting') return this.departmentService.all({ select, order: { code: true } });
    if (entity == 'DocumentSetting') return this.documentService.all({ select });
    if (entity == 'LanguageSetting') return this.languageService.all({ select, order: { code: true } });
    if (entity == 'MunicipalitySetting') return this.munipalityService.all({ select, order: { code: true } });
    if (entity == 'ReasonStart') return this.reasonService.all({ select, order: { code: true } });
    if (entity == 'UnitSetting') return this.unitService.all({ select, order: { code: true } });
    if (entity == 'SourceStart') return this.sourceService.all({ select, order: { code: true } });
  }

  async formSelect(fields: string[]): Promise<object> {
    const objectFields: Record<string, any> = {};
    fields.forEach((element) => {
      objectFields[element] = true;
    });

    return objectFields;
  }
}
