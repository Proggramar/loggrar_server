import { Request, Response } from 'express';

import { Injectable } from '@nestjs/common';
import { v4 as uuid, validate as uuidValidate } from 'uuid';
import { JwtService } from '@nestjs/jwt';

import { MyCrypt, MySecurity } from '@common/helpers/security';
import { JwtPayLoad, JwtTenant } from '@common/interfaces';
import { MyTools } from '@common/helpers/varius';

import { UserService } from '@safety/users/user.service';
import { EnterpriseService } from '@system/enterprises/enterprise.service';
import { Enterprise } from '@system/enterprises/entities/enterprise.entity';
import { UserBranchesService } from '@safety/users-branches/user-branches.service';
import { BranchService } from '@system/branches/branch.service';
import { RolService } from '@safety/roles/rol.service';
import { PermissionService } from '@safety/permissions/permission.service';
import { UserCredential, UserDataLogin } from '@safety/users/interfaces';

@Injectable()
export class AuthService {
  private readonly myCripto = new MyCrypt({});
  private readonly mySecurity = new MySecurity();
  private readonly myTools = new MyTools();

  constructor(
    private readonly userService: UserService,
    private readonly enterpriseService: EnterpriseService,
    private readonly userBranchesService: UserBranchesService,
    private readonly branchService: BranchService,
    private readonly rolService: RolService,
    private readonly permissionService: PermissionService,
  ) {}

  async makePassportToken(): Promise<string> {
    const prepapeLoginUUID: string = uuid();
    const prepareLoginCifrated: string = await this.myCripto.encrypt(prepapeLoginUUID);
    const payload: JwtPayLoad = { sub: prepareLoginCifrated, data: { other: prepapeLoginUUID }, scope: 'Passport' };
    const jwtService = new JwtService({
      secret: process.env.BACK_TOKEN_JWT_SECRET,
      signOptions: { expiresIn: process.env.BACK_TOKEN_JWT_APP_EXPIRES },
    });
    const jwtApp = await jwtService.signAsync(payload);

    return jwtApp;
  }

  async makeTokenToLogin(req: Request): Promise<object> {
    const prepapeLoginUUID: string = uuid();
    const ip: string = req.socket.remoteAddress;
    const clientIP: string = ip == '::1' ? '127.0.0.1' : ip;
    const ipCifrated: string = await this.myCripto.encrypt(clientIP);
    const baseRamdom: string = await this.mySecurity.numbersFromTimer(6);
    const otp: string = await this.mySecurity.numbersFromTimer(4);
    const passBase: string = await this.mySecurity.encode(await this.mySecurity.generatePasswordSeed({ baseRamdom }));

    const prepareLoginUUIDCifrated: string = await this.myCripto.encrypt(prepapeLoginUUID);

    const other: object = { uuid: prepapeLoginUUID, otp, passBase };
    const tenantDefault: JwtTenant = {
      id: '',
      database: process.env.BACK_DATABASE_NAME,
      host: process.env.BACK_DATABASE_HOST,
      port: +process.env.BACK_DATABASE_PORT,
    };
    const payload: JwtPayLoad = {
      sub: prepareLoginUUIDCifrated,
      data: { ip: ipCifrated, other, tenant: tenantDefault },
      scope: 'toLogin',
    };

    const duration = process.env.BACK_TOKEN_JWT_LOGIN_EXPIRES;

    const jwtService = new JwtService({ secret: process.env.BACK_TOKEN_JWT_SECRET, signOptions: { expiresIn: duration } });
    const token = await jwtService.signAsync(payload);
    return { token, otp, wizard: passBase, duration };
  }

  async login(userCredentials: UserCredential, request: Request, userReq: any) {
    const ip = userReq.data.ip;
    const otp = userReq.data.other.otp;
    const passBase = userReq.data.other.passBase;
    const ipToValidate = request.socket.remoteAddress;

    await this.myTools.validateIP(ip, ipToValidate);
    await this.myTools.validateOTP(userCredentials.otp, otp);
    const { user, password } = await this.userService.descrifateCredencials(userCredentials, passBase);

    const userDB: UserDataLogin = await this.userService.getUser(user, password);
    const enterprise: Enterprise = await this.enterpriseService.findOne({ where: { id: userDB.tenant } });
    const tenantDatabase: JwtTenant = { ...JSON.parse(enterprise.database_information), id: userDB.tenant } as JwtTenant;
    const toExpire = await this.enterpriseService.checkEnterpriseToken(enterprise);

    const branchesRoles: any[] = await this.userBranchesService.findBranches(userDB.user);
    let tokens: string[] = [];

    // read menu
    const menuOptions = {
      menu: [],
      favorites: [],
    };
    if (branchesRoles.length == 1) {
      const payLoad: JwtPayLoad = {
        sub: userDB.user,
        scope: 'User',
        data: { ip, branch: branchesRoles[0].branchId, tenant: tenantDatabase },
      };
      const token = await this.myTools.createExpireToken(payLoad);
      tokens.push(token);
      const { validMenu, favorites } = await this.permissionService.readMenu(userDB.user, branchesRoles[0].rolId);
      menuOptions.menu = validMenu;
      menuOptions.favorites = favorites;
    }
    const userData = await this.myTools.mergeData(userDB, {
      entrerprise_name: enterprise.name,
      account_params: enterprise.params_account,
      branchesRoles,
      tokens,
      expireSoon: toExpire,
      ...menuOptions,
    });

    return userData;
  }
}
