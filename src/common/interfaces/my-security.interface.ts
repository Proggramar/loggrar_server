export interface generatePasswordSeedOptions {
  baseRamdom?: string;
  hasNumbers?: boolean;
  hasAlpha?: boolean;
  hasSpecial?: boolean;
}

export interface MyOtp {
  text?: string;
  secret?: string;
  size?: number;
}
