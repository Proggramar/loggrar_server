import { Licences, Suscriptions } from '@modules/system/enterprises/enums';

export type JwtScope = 'Passport' | 'toLogin' | 'User';

export interface JwtPayLoad {
  sub: string;
  data?: {
    ip?: string;
    branch?: string;
    other?: string | JwtOther | JwtLicenses;
    salt?: string;
    tenant?: JwtTenant;
  };
  scope?: JwtScope;
}

export interface JwtTenant {
  id: string;
  host: string;
  port: number;
  database: string;
}

export interface JwtOther {
  uuid?: string;
  otp?: string;
  passBase?: string;
}

export interface JwtLicenses {
  enterpriseName?: string;
  license?: Licences;
  susctiption?: Suscriptions;
  otp_date?: string;
}
