import { SetMetadata } from '@nestjs/common';
// import { dataGuard } from './auth.decorator';

export const META_ROLES = 'AllowedRoles';

export const RolProtected = (dataToGuard: unknown) => SetMetadata(META_ROLES, dataToGuard);
