import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { MyCrypt } from '@common/helpers/security';
import { JwtPayLoad, JwtOther } from '@common/interfaces';
import { JwtScope } from '@common/interfaces/jwt.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly myCripto = new MyCrypt({});
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.BACK_TOKEN_JWT_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payLoad: JwtPayLoad): Promise<JwtPayLoad> {
    try {
      var { sub, data, scope } = payLoad;
    } catch (e) {
      throw new UnauthorizedException('expired/bad token');
    }

    if (scope == 'Passport') {
      return await this.processPassport(payLoad);
    }

    if (scope == 'toLogin') {
      return await this.processLogin(payLoad);
    }

    if (scope == 'User') {
      return payLoad;
      // return await this.processUser(payLoad);
    }

    if (scope == 'AppData') {
      return await this.processAppData(payLoad);
    }
    throw new UnauthorizedException('Invalid scope');
  }

  async processPassport(payLoad: JwtPayLoad) {
    var { sub, data, scope } = payLoad;
    const UUID = await this.myCripto.decrypt(sub);
    const toValid = data.other;

    if (UUID !== toValid) throw new UnauthorizedException('Invalid passport');
    if (UUID !== process.env.BACK_APP_PASSPORT) {
      if (process.env.NODE_ENV == 'dev') {
        console.log('uuid: ', UUID);
        console.log('env: ', process.env.BACK_APP_PASSPORT);
      }
      throw new UnauthorizedException('Invalid passport (env)');
    }
    const toReturn: JwtPayLoad = {
      sub: '',
      data: {},
      scope: scope,
    };

    return toReturn;
  }

  async processLogin(payLoad: JwtPayLoad) {
    var { sub, data, scope } = payLoad;
    const UUID = await this.myCripto.decrypt(sub);
    const other: JwtOther = data.other as JwtOther;
    const toValid = other.uuid;
    if (UUID !== toValid) throw new UnauthorizedException('Invalid token');

    const { ip } = data;

    const toReturn: JwtPayLoad = {
      sub: '',
      data: { ip, other },
      scope: scope,
    };

    return toReturn;
  }

  async processAppData(payLoad: JwtPayLoad) {
    var { sub, data, scope } = payLoad;
    const toReturn: JwtPayLoad = {
      sub,
      data: { other: data.other },
      scope,
    };
    return toReturn;
  }
}
