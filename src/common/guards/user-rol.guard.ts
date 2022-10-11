import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { META_ROLES } from '@common/decorators';
import { MyCrypt, MySecurity } from '@common/helpers/security';
// import { dataGuard } from '@common/decorators/auth.decorator';
import { MyTools } from '@common/helpers/varius';
import { UserBranchesService } from '@modules/safety/users-branches/user-branches.service';
import { MyModuleService } from '@modules/safety/app-modules/module.service';

@Injectable()
export class UserRoleGuard implements CanActivate {
  private readonly myTools = new MyTools();
  private readonly mySecurity = new MySecurity();
  constructor(
    private reflector: Reflector,
    private userBranchesService: UserBranchesService,
    private myAppModuleService: MyModuleService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { roles, actions } = this.reflector.get(META_ROLES, context.getHandler());

    const { sub, data, scope } = request.user;

    if (scope == 'toLogin' || scope == 'User') {
      const { ip } = data;
      const ipToValidate = request.socket.remoteAddress;
      this.myTools.validateIP(ip, ipToValidate);
    }

    if (scope == 'User') {
      if (!roles) {
        return true;
      }

      const route: string = request.route.path;
      let path: string | any = route.split('/:')[0].split('/').pop();
      if (path.includes('_')) {
        path = route.split('/:')[0].split('/');
        path.pop();
        path = path.pop();
      }
      if (path.includes('listGrid')) path = route.replace('/listGrid', '').split('/:')[0].split('/').pop();

      const module = await this.myAppModuleService.findOne({ where: { route: path } });
      if (!module) throw new NotFoundException(`module not found for route: ${path}`);

      const rolesForUser = await this.userBranchesService.findBranches(sub, data.branch, module.id);
      if (!rolesForUser) return false;
      const userRoles: string[] = [];
      for (const rol of rolesForUser) {
        const permissionData = await this.myTools.byte2Araay(rol.modulePermission);
        const pinPermission = await this.mySecurity.otp({
          text: rol.modulePermission.toString() + rol.rolId + module.id,
          size: 6,
        });

        const permissionEnter = permissionData.reduce((sum, val) => sum + val, 0);
        if (pinPermission == rol.pinPermission && permissionEnter > 0 && !userRoles.includes(rol.rol_type))
          userRoles.push(rol.rolType);
      }
      return roles.some((rol: string) => userRoles?.includes(rol));
    }

    return true;
  }
}
