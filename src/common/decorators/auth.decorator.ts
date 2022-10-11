import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ValidRoles, ValidAcions } from '@safety/roles/enums';
import { RolProtected } from '@common/decorators';
import { UserRoleGuard } from '@common/guards/';

export function Auth(dataToGuard: unknown) {
  return applyDecorators(RolProtected(dataToGuard), UseGuards(AuthGuard(), UserRoleGuard));
}
