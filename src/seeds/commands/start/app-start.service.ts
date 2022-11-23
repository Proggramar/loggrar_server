import { Injectable, Logger } from '@nestjs/common';

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
import { CivilService } from '@loggrar/setting/civilState/civilstate.service';
import { CurrencyService } from '@loggrar/setting/currency/currency.service';
import { DepartmentService } from '@loggrar/setting/departments/department.service';
import { MunicipalityService } from '@loggrar/setting/municipality/municipality.service';
import { DocumentService } from '@loggrar/setting/documents/document.service';
import { LanguageService } from '@loggrar/setting/languages/Language.service';
import { UnitService } from '@loggrar/setting/units/unit.service';
import { PayRollReasonService } from '@loggrar/payroll/Start/reasonDismissal/reason.service';

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
    private readonly civilService: CivilService,
    private readonly currencyService: CurrencyService,
    private readonly departmentService: DepartmentService,
    private readonly municipalityService: MunicipalityService,
    private readonly documentService: DocumentService,
    private readonly languageService: LanguageService,
    private readonly unitService: UnitService,
    private readonly reasonService: PayRollReasonService,
  ) {}

  async appStart() {
    Logger.warn('Starting application... ');

    Logger.debug('populate countries... ');
    const countries: CountryCreateDto[] = await this.countryService.getCountriesData();
    const countriesSaved = await this.countryService.saveCountriesFromArray(countries);

    Logger.debug('populate enterprises... ');
    const appTenant: EnterpriseCreateDto = await this.enterpriseService.getTenantData();
    const tenantCreated: Enterprise = (await this.enterpriseService.createStartEnterprise(
      appTenant,
      countriesSaved,
    )) as Enterprise;

    const country = await this.countryService.getCountryByCodeFromArray(countriesSaved, appTenant.country);

    Logger.debug('populate departments... ');
    const dempartments = await this.departmentService.getDepartmentsData(country.alpha2);
    await this.departmentService.saveDepartmentsFromArray(dempartments, country);

    Logger.debug('populate municipalities... ');
    const municipalities = await this.municipalityService.getMunicipalitiesData(country.alpha2);
    await this.municipalityService.saveMunicipalitiesFromArray(municipalities, country);

    Logger.debug('populate accounts... ');
    const accountsData = await this.accountService.getAccountsData(country.alpha2);
    await this.accountService.saveAccountsFromArray(accountsData);
    await this.accountService.updateIdFather();

    Logger.debug('populate branchs... ');
    const branchData: BranchCreateDto = await this.branchService.getBranchData(tenantCreated);
    const branchSaved: Branch = (await this.branchService.create(branchData)) as Branch;

    Logger.debug('populate appliction modules... ');
    const myModules: MyModule[] = await this.myAppModuleService.getModulesData();
    const myModulesSaved = await this.myAppModuleService.saveModulesFromArray(myModules);
    await this.myAppModuleService.organizeHierarchicalStructure();

    Logger.debug('populate update applications for enterprise... ');
    const applications: MyModule[] = myModules.filter((module) => module.father_id == '0');
    await this.enterpriseService.saveApplitcationsPermission(applications, tenantCreated);

    Logger.debug('populate roles... ');
    const myRoles: Rol[] = await this.rolesServices.getRolesData();
    const idRolSuperAdmin = await this.rolesServices.saveRolesFromArray(myRoles);

    Logger.debug('populate permissions... ');
    await this.permissionService.generateAndSaveRolPermission(idRolSuperAdmin, myModulesSaved);
    const userSaved: User = (await this.userService.createSuperAdmin(idRolSuperAdmin, tenantCreated.id)) as User;

    Logger.debug('populate user branches... ');
    await this.userBranchesService.createUserBranches(userSaved, branchSaved, idRolSuperAdmin);

    Logger.debug('populate civil states... ');
    const civilStates = await this.civilService.getCivilData(country.alpha2);
    await this.civilService.saveCivilFromArray(civilStates);

    Logger.debug('populate currencies... ');
    const currencies = await this.currencyService.getCurrencyData();
    await this.currencyService.saveCurrencyFromArray(currencies);

    Logger.debug('populate documents... ');
    const documents = await this.documentService.getDocumentsData(country.alpha2);
    await this.documentService.saveDocumentsFromArray(documents);

    Logger.debug('populate languages... ');
    const languages = await this.languageService.getLanguageData();
    await this.languageService.saveLanguageFromArray(languages);

    Logger.debug('populate units... ');
    const units = await this.unitService.getUnitData();
    await this.unitService.saveUnitFromArray(units);

    Logger.debug('populate reasons... ');
    const reasons = await this.reasonService.getReasonsData(country.alpha2);
    await this.reasonService.saveReasonsFromArray(reasons);

    Logger.warn('Starting application finished.');
  }
}
