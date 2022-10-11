import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';

import { JwtStrategy } from '@common/strategies/jwt.strategy';

// Modules
import { UserModule } from '@safety/users/user.module';
import { PermissionModule } from '@safety/permissions/permission.module';
import { UserBranchesModule } from '@safety/users-branches/user-branches.module';
import { MyModuleModule } from '@safety/app-modules/module.module';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      useFactory: () => {
        return {
          secret: process.env.BACK_TOKEN_JWT_SECRET,
          signOptions: {
            expiresIn: process.env.BACK_TOKEN_JWT_USER_EXPIRES,
            audience: process.env.BACK_TOKEN_JWT_AUDIENCE,
          },
        };
      },
    }),

    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        ttl: +process.env.BACK_APP_TTL_TIME,
        limit: +process.env.BACK_APP_TTL_LIMIT,
      }),
    }),

    UserModule,
    PermissionModule,
    UserBranchesModule,
    MyModuleModule,
  ],
  providers: [JwtStrategy],
  // providers: [JwtStrategy, MySecurity],
  exports: [JwtModule, PassportModule, JwtStrategy, UserModule, UserBranchesModule, PermissionModule, MyModuleModule],
  // exports: [JwtModule, PassportModule, JwtStrategy, UserSecurity, UserModule],
})
export class CoreSecurityModule {}
