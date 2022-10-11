import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MySecurity, TableLogger } from '@common/helpers/security';
import { MyTools } from '@common/helpers/varius';
import { ValidAcions } from '@safety/roles/enums';
import { DbAbstract } from '@common/database/database-abstact.service';
import { Rol } from './entities/rol.entity';
import { PermissionService } from '@safety/permissions/permission.service';
import { RolCreateDto } from './dto';

@Injectable()
export class RolService extends DbAbstract {
  private readonly myTools = new MyTools();
  private readonly mySecurity = new MySecurity();

  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
    private readonly permissionService: PermissionService,
  ) {
    super(rolRepository);
  }
  async getPermissionModuleByRol(rol: string): Promise<any> {
    const dataModulesByRol = await this.permissionService.getPermissionByRol(rol);

    let dataModules: any = [];
    for await (let option of dataModulesByRol) {
      if (option.permission && option.permission > 0) {
        option.permissionData = await this.myTools.byte2Araay(option.permission);

        const pinPermits = await this.mySecurity.otp({
          text: option.permission.toString() + rol + option.idModule,
          size: 6,
        });

        if (pinPermits == option.pinPermission) {
          const { idRol, permission, pinPermission, ...menuValid } = option;
          dataModules.push(menuValid);
        }
      } else {
        option.permissionData = [0, 0, 0, 0, 0, 0, 0, 0];
        const { idRol, permission, pinPermission, ...menuValid } = option;
        dataModules.push(menuValid);
      }
    }

    return dataModules;
  }

  async savePermissionModuleByRol({ id, data, userId }): Promise<any> {
    let dataToSave: any[] = [];
    for (const item of data) {
      if (item.permissions[1] == 0) item.permissions = [0, 0, 0, 0, 0, 0, 0, 0]; // CRUD (r, homologa ejecutar en procesos)

      const permissionData = await this.myTools.array2Byte(item.permissions);

      const pinPermission = await this.mySecurity.otp({
        text: permissionData.toString() + id + item.id,
        size: 6,
      });

      dataToSave.push({ rol: id, module: item.id, permission: permissionData, pin_permission: pinPermission });
    }
    const myLogger = new TableLogger();
    myLogger.logProcess(ValidAcions.create, 'Roles', userId, 'Grabó permisos rol: ' + id);
    return await this.permissionService.savePermissions(id, dataToSave);
  }

  async getRolesData(): Promise<any> {
    const mainTentanFile: string = await this.myTools.getFileName('../../../seeds/data-to-seed/roles-data.json');
    const rolesData: RolCreateDto[] = await this.myTools.getDataFromFile(mainTentanFile);
    return rolesData;
  }

  async saveRolesFromArray(myRoles: Rol[]): Promise<string> {
    let idRolSuperAdmin: string = '';
    for await (const record of myRoles) {
      const roleSaved: Rol = (await this.create(record)) as Rol;
      if (idRolSuperAdmin == '') idRolSuperAdmin = roleSaved.id;
    }
    return idRolSuperAdmin;
  }
}
