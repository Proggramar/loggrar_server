import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { DbAbstract } from '@common/database/database-abstact.service';
import { Permissions } from './entities/permission.entity';
import { permissionData } from './interfaces/permissionData.interface';
import { MySecurity } from '@common/helpers/security';
import { MyTools } from '@common/helpers/varius';
import { Favorite } from '@system/menu/entities/favorite.entity';
import { MyModule } from '@safety/app-modules/entities/my-module.entity';

@Injectable()
export class PermissionService extends DbAbstract {
  private readonly mySecurity = new MySecurity();
  private readonly myTools = new MyTools();
  constructor(
    @InjectRepository(Permissions)
    private readonly permissionRepository: Repository<Permissions>,
    private readonly dataSource: DataSource,
  ) {
    super(permissionRepository);
  }

  async readMenu(user_id: string, rol_id: string, module_id: string = ''): Promise<any> {
    const dataMenu = await this.getMenuData(rol_id, module_id);
    const favoriteMenu = await this.getFavorites(user_id);

    let dataMenuFilter: permissionData[] = [];
    for await (let option of dataMenu) {
      if (option.permission && option.permission > 0) {
        option.permissionData = await this.myTools.byte2Araay(option.permission);

        const pinPermission = await this.mySecurity.otp({
          text: option.permission.toString() + rol_id + option.idModule,
          size: 6,
        });

        // 0.Create, 1.Updtae, 2.Delete, 3.Execute  (Process, list, report)
        // const permissionEnter = option.permissionData.reduce((sum, val) => sum + val, 0);
        // if (pinPermission == option.pinPermission && permissionEnter > 0) {
        if (pinPermission == option.pinPermission) {
          const { idRol, permission, pinPermission, ...menuValid } = option;
          dataMenuFilter.push(menuValid);
        }
      }
    }

    return { validMenu: dataMenuFilter, favorites: favoriteMenu };
  }
  async decriptCodeSecurity(idModule: number, idRol: number, code: string): Promise<number[]> {
    let codeNumber: number = 0;
    let permissions: number[] = [];
    let number: number = 0;
    for (let i = 0; i < 6; i++) {
      codeNumber = parseInt(code.substr(i * 7, 7));
      number = 99 - idRol;
      codeNumber -= number * 100000 + idModule * 100;
      if (codeNumber > 1) codeNumber = 0;
      permissions.push(codeNumber);
    }
    return permissions;
  }

  async getMenuData(rol_id: string, module_id: string = ''): Promise<permissionData[]> {
    try {
      let query = this.dataSource
        .createQueryBuilder()
        .from(Permissions, 'permission')
        .select(
          'permission.permission permission, permission.pin_permission pinPermission, ' +
            'module.id idModule, module.name moduleName, ' +
            'module.component menuComponent, module.video_tutorial menuVideo, ' +
            'module.father_id menuFather, module.menu_order menuOrder',
        )
        .leftJoin('permission.module', 'module')
        .where('permission.rol_id = :id', { id: rol_id })
        .orderBy('module.father_id , module.menu_order');
      if (module_id !== '')
        query = query.andWhere('module.id = :idm', {
          idm: module_id,
        });
      const menuInformation: permissionData[] = await query.getRawMany();
      return menuInformation;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  async getFavorites(user_id: string): Promise<any> {
    try {
      let query = this.dataSource
        .createQueryBuilder()
        .from(Favorite, 'Favorite')
        .select(
          'module.id idModule, module.name moduleName, ' +
            'module.component menuComponent, module.video_tutorial menuVideo, ' +
            'module.father_id menuFather, module.menu_order menuOrder',
        )
        .leftJoin('Favorite.module', 'module')
        .where('Favorite.user_id= :id', { id: user_id })
        .orderBy('module.father_id , module.menu_order');
      const data: any[] = await query.getRawMany();
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  async getPermissionByRol(rol: string): Promise<any> {
    let data: any[] = [];

    try {
      let query = this.dataSource
        .createQueryBuilder()
        .from(MyModule, 'appModule')
        .select(
          'appModule.id idModule, appModule.name name,appModule.father_id menuFather, ' +
            'permissions.rol_id idRol, permissions.permission permission,permissions.pin_permission pinPermission, ' +
            ' "" toSpace',
        )
        .leftJoin('appModule.permissions', 'permissions', 'permissions.rol_id = :id', { id: rol })
        // .where('permissions.rol_id= :id', { id: rol })
        .orderBy('appModule.father_id , appModule.menu_order');

      data = await query.getRawMany();
    } catch (e) {
      console.error(e);
    }

    return data;
  }

  async savePermissions(rol: string, data: any): Promise<any> {
    await this.permissionRepository.createQueryBuilder().delete().from(Permissions).where('rol = :id', { id: rol }).execute();
    return await this.permissionRepository.save(data);
  }

  async generateAndSaveRolPermission(rol: string, modules: string[]) {
    const permissionData = await this.myTools.array2Byte([1, 1, 1, 1, 0, 0]); // CRUD (r, homologa ejecutar en procesos)
    modules.forEach(async (module) => {
      const pin_permission = await this.mySecurity.otp({ text: permissionData.toString() + rol + module, size: 6 });
      const permissionRecord = { rol, module, permission: permissionData, pin_permission };
      this.create(permissionRecord);
    });
  }
}
