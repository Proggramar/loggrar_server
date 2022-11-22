import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DbAbstract } from '@common/database/database-abstact.service';
import { MyModule } from './entities/my-module.entity';
import { MyTools } from '@common/helpers/varius';
import { MyModuleCreateDto } from './dto';

@Injectable()
export class MyModuleService extends DbAbstract {
  private readonly myTools = new MyTools();
  constructor(
    @InjectRepository(MyModule)
    private readonly moduleRepository: Repository<MyModule>,
  ) {
    super(moduleRepository);
  }

  async getModulesData(): Promise<any> {
    const mainTentanFile: string = await this.myTools.getFileName('../../../seeds/data-to-seed/my-module-data.json');
    const modulesData: MyModuleCreateDto[] = await this.myTools.getDataFromFile(mainTentanFile);
    return modulesData;
  }

  async saveModulesFromArray(myModules: MyModule[]): Promise<string[]> {
    let myModulesSaved: string[] = [];
    for await (const record of myModules) {
      const moduleSaved = (await this.create(record)) as MyModule;
      myModulesSaved.push(moduleSaved.id);
    }
    return myModulesSaved;
  }

  async organizeHierarchicalStructure() {
    const myModulesToOrganizeHierarchicalStructure = await this.findAll({});
    for await (const module of myModulesToOrganizeHierarchicalStructure) {
      if (module.father_id != '0') {
        const moduleFather = await this.findOne({ where: { id_old: module.father_id } });
        await this.update(module.id, { father_id: moduleFather.id });
      }
    }

    // update father_old for future seeds in tenant database
    for await (const module of myModulesToOrganizeHierarchicalStructure) {
      await this.update(module.id, { id_old: module.id });
    }
  }
}
