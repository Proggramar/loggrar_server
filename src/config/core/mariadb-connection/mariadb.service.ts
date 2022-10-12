import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from './snake-naming.strategy';
import { ExtractJwt } from 'passport-jwt';
import { MySecurity } from '@common/helpers/security';
import { JwtService } from '@nestjs/jwt';
import { JwtTenant } from '@common/interfaces';

@Injectable({ scope: Scope.REQUEST })
export class MariaConfigService {
  static tenant: JwtTenant;
  private readonly mySecurity = new MySecurity();
  constructor(@Inject(REQUEST) private readonly request: Request, private readonly jwtService: JwtService) {
    // console.log(this.request);

    const headers = this.request.headers as any;
    const bearerFroHheaders = this.mySecurity.getTokenFromBearer(headers.authorization);
    const { data } = this.jwtService.decode(bearerFroHheaders) as any;
    const tenantDefault: JwtTenant = {
      id: '',
      database: process.env.BACK_DATABASE_NAME,
      host: process.env.BACK_DATABASE_HOST,
      port: +process.env.BACK_DATABASE_PORT,
    };

    MariaConfigService.tenant = data.tenant ? data.tenant : tenantDefault;
    // Logger.debug('Connecting to database: ' + MariaConfigService.tenant.database);
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mariadb',
      host: MariaConfigService.tenant.host,
      port: MariaConfigService.tenant.port,
      database: MariaConfigService.tenant.database,
      username: process.env.BACK_DATABASE_USER,
      password: process.env.BACK_DATABASE_PASSWORD,
      autoLoadEntities: process.env.BACK_DATABASE_AUTOLOAD_ENTITIES === 'true',
      synchronize:
        process.env.NODE_ENV !== ('prod' || 'production' || 'stag' || 'staging')
          ? process.env.BACK_DATABASE_SYNCHRONIZE === 'true'
          : false,
      logging: process.env.BACK_DATABASE_LOGGING === 'true',
      namingStrategy: new SnakeNamingStrategy(),
    };
  }

  // TypeOrmModule.forRootAsync({
  //   async useFactory() {
  //     return {
  //       type: 'mariadb',
  //       host: process.env.BACK_DATABASE_HOST,
  //       port: +process.env.BACK_DATABASE_PORT,
  //       database: process.env.BACK_DATABASE_NAME,
  //       username: process.env.BACK_DATABASE_USER,
  //       password: process.env.BACK_DATABASE_PASSWORD,
  //       autoLoadEntities:
  //         process.env.BACK_DATABASE_AUTOLOAD_ENTITIES === 'true',
  //       synchronize:
  //         process.env.NODE_ENV !== ('production' || 'staging') ? true : false,
  //       // synchronize: process.env.BACK_DATABASE_SYNCHRONIZE === 'true',
  //       logging: process.env.BACK_DATABASE_LOGGING === 'true',
  //       namingStrategy: new SnakeNamingStrategy(),
  //     };
  //   },
  // }),
  // createMongooseOptions(): MongooseModuleOptions {
  //   return {
  //     uri:
  //     MariaConfigService.tenant == 'default'
  //         ? `mongodb://${process.env.BACK_DATABASE_USER_ADMIN}:${encodeURIComponent(process.env.BACK_DATABASE_PASSWORD)}@${
  //             process.env.BACK_DATABASE_HOST
  //           }:${process.env.BACK_DATABASE_PORT}/` +
  //           `${process.env.BACK_DATABASE_NAME}?authSource=admin&authMechanism=SCRAM-SHA-256`
  //         : `mongodb://${process.env.BACK_DATABASE_USER_ADMIN}:${encodeURIComponent(process.env.BACK_DATABASE_PASSWORD)}@${
  //             process.env.BACK_DATABASE_HOST
  //           }:${process.env.BACK_DATABASE_PORT}/` +
  //           `${MariaConfigService.tenant}?authSource=admin&authMechanism=SCRAM-SHA-256`,
  //   };
  // }
}
