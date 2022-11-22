import { Injectable, Logger } from '@nestjs/common';

import { MyTools } from '@common/helpers/varius';
import { IfileSeeder } from '@common/interfaces';
import { MyModuleService } from '@safety/app-modules/module.service';

@Injectable()
export class ReverseSeedersService {
  private readonly myTools = new MyTools();
  constructor(private readonly myAppModuleService: MyModuleService) {}

  async reverseSeeders() {
    const filesDataToReverse: string[] = ['my-module', 'civil-state-data&&&'];
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
      let entity = await this.myTools.mathEntity(file.file, entitiesFiles);
      const fileName = file.file.split('.')[0];
      if (entity !== '') {
        const fields = await this.myTools.retrieveFields(file);
        const dataFromTable = await this.getData(entity, fields);
        let dataToFile = dataFromTable;
        if (!fields.includes('id')) {
          dataToFile = dataFromTable.map((element) => {
            delete element.id;
            return element;
          });
        }
        Logger.debug(`Retrieve: [ ${fileName} ] Records reversed: ` + dataFromTable.length + ' ...');
        this.myTools.saveFile(directory + '/' + file.file, JSON.stringify(dataFromTable));
      } else {
        Logger.error(`Retrieve: [  ${fileName}  ] Not math entity ...`);
      }
    }

    Logger.warn('Reverse finished.');
  }
  async getData(entity: string, fields: string[]): Promise<any> {
    const select = await this.formSelect(fields);
    if (entity == 'MyModule') return this.myAppModuleService.all({ select });
  }

  async formSelect(fields: string[]): Promise<object> {
    const objectFields: Record<string, any> = {};
    fields.forEach((element) => {
      objectFields[element] = true;
    });

    return objectFields;
  }
}
