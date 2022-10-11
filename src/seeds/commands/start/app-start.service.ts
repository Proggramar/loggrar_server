import { Injectable } from '@nestjs/common';

import { EnterpriseCreateDto } from '@system/enterprises/dto';
import { MyModule } from '@safety/app-modules/entities/my-module.entity';
import { EnterpriseService } from '@system/enterprises/enterprise.service';
import { Enterprise } from '@system/enterprises/entities/enterprise.entity';
import { PermissionService } from '@safety/permissions/permission.service';
import { UserService } from '@safety/users/user.service';
import { BranchCreateDto } from '@system/branches/dto';
import { BranchService } from '@system/branches/branch.service';
import { MyModuleService } from '@safety/app-modules/module.service';
import { RolService } from '@modules/safety/roles/rol.service';
import { UserBranchesService } from '@safety/users-branches/user-branches.service';
import { Branch } from '@system/branches/entities/branch.entity';
import { Rol } from '@modules/safety/roles/entities/rol.entity';
import { User } from '@safety/users/entities/user.entity';

@Injectable()
export class AppStartService {
  constructor(
    private readonly enterpriseService: EnterpriseService,
    private readonly permissionService: PermissionService,
    private readonly userService: UserService,
    private readonly branchService: BranchService,
    private readonly myAppModuleService: MyModuleService,
    private readonly rolesServices: RolService,
    private readonly userBranchesService: UserBranchesService,
  ) {}

  async appStart() {
    const appTenant: EnterpriseCreateDto = await this.enterpriseService.getTenantData();
    const tenantCreated: Enterprise = (await this.enterpriseService.createEnterprise(appTenant)) as Enterprise;

    const branchData: BranchCreateDto = await this.branchService.getBranchData(tenantCreated);
    const branchSaved: Branch = (await this.branchService.create(branchData)) as Branch;

    const myModules: MyModule[] = await this.myAppModuleService.getModulesData();
    const myModulesSaved = await this.myAppModuleService.saveModulesFromArray(myModules);
    await this.myAppModuleService.organizeHierarchicalStructure();

    const applications: MyModule[] = myModules.filter((module) => module.father_id == '0');
    await this.enterpriseService.saveApplitcationsPermission(applications, tenantCreated);

    const myRoles: Rol[] = await this.rolesServices.getRolesData();
    const idRolSuperAdmin = await this.rolesServices.saveRolesFromArray(myRoles);

    await this.permissionService.generateAndSaveRolPermission(idRolSuperAdmin, myModulesSaved);

    const userSaved: User = (await this.userService.createSuperAdmin(idRolSuperAdmin, tenantCreated.id)) as User;

    await this.userBranchesService.createUserBranches(userSaved, branchSaved, idRolSuperAdmin);
  }
}
