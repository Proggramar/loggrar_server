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
import { RolService } from '@safety/roles/rol.service';
import { UserBranchesService } from '@safety/users-branches/user-branches.service';
import { Branch } from '@system/branches/entities/branch.entity';
import { Rol } from '@safety/roles/entities/rol.entity';
import { User } from '@safety/users/entities/user.entity';
import { CountryCreateDto } from '@loggrar/setting/country/dto';
import { CountryService } from '@loggrar/setting/country/country.service';
import { AccountsService } from '@loggrar/account/frequent/accounts/accounts.service';

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
    private readonly countryService: CountryService,
    private readonly accountService: AccountsService,
  ) {}

  async appStart() {
    const countries: CountryCreateDto[] = await this.countryService.getCountriesData();
    const countriesSaved = await this.countryService.saveCountriesFromArray(countries);

    const appTenant: EnterpriseCreateDto = await this.enterpriseService.getTenantData();
    const tenantCreated: Enterprise = (await this.enterpriseService.createStartEnterprise(
      appTenant,
      countriesSaved,
    )) as Enterprise;

    const country = await this.countryService.getCountryByCodeFromArray(countriesSaved, appTenant.country);
    const accountsData = await this.accountService.getAccountsData(country.alpha2);
    await this.accountService.saveAccountsFromArray(accountsData);
    await this.accountService.updateIdFather();

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
