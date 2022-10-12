import { createHmac } from 'crypto';
import { MyCrypt } from './my-crypto';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { generatePasswordSeedOptions, MyOtp } from '@common/interfaces';

export class MySecurity {
  async otp({ text, secret = 'walter echavarria pardo', size = 6 }: MyOtp): Promise<string> {
    const hmac: any = [...createHmac('sha1', secret).update(text).digest('hex')];

    const offset = hmac[19] & 0xf;

    let code = String(
      ((hmac[offset] & 0x7f) << 24) |
        ((hmac[offset + 1] & 0xff) << 16) |
        ((hmac[offset + 2] & 0xff) << 8) |
        (hmac[offset + 3] & 0xff),
    );

    return `${new Array(size).fill('0')}${code}`.replace(/,/g, '').slice(-1 * size);
  }

  async numbersFromTimer(numberLen: number): Promise<string> {
    return ('' + new Date().getTime()).slice(0 - numberLen);
  }

  async generatePasswordSeed({
    baseRamdom = '*',
    hasNumbers = true,
    hasAlpha = true,
    hasSpecial = true,
  }: generatePasswordSeedOptions): Promise<string> {
    if (baseRamdom == '*') baseRamdom = await this.numbersFromTimer(6);
    const ramdomIterationCicle = [...baseRamdom];

    const baseNumbers: string = hasNumbers ? '0123456789' : '';
    const baseAlpha: string = hasAlpha ? 'abcdefghijklmnopqrstuvwxyz' : '';
    const baseSpecial: string = hasSpecial ? '@#$%=*+-!:' : '';

    const baseCharaters = [...(baseAlpha + baseNumbers + baseSpecial)];

    const numberMax = baseCharaters.length;
    if (numberMax < 1) {
      return '';
    }

    const minNumber: number = 0;
    let generatePasswordSeed: string = '';
    let pos: number = 0;

    ramdomIterationCicle.map((num) => {
      let iterationCicle = +num;
      for (let i = 0; i < iterationCicle; i++) {
        pos = Math.floor(Math.random() * (numberMax - minNumber + 0) + minNumber);
      }
      generatePasswordSeed += baseCharaters[pos];
    });
    return generatePasswordSeed;
  }

  async fibonacci(num: number): Promise<number> {
    let a = 1;
    let b = 0;
    let c = 0;

    while (num >= 0) {
      c = a;
      a += b;
      b = c;
      num--;
    }
    return b;
  }

  async resumeDigits(num: number, countDigits: number): Promise<number> {
    let values = [...('' + num)];
    let sum = 0;
    while (values.length > countDigits) {
      sum = values.reduce((sum, num) => sum + parseInt(num), 0);
      values = [...('' + sum)];
    }
    return sum;
  }

  async decode(str: string): Promise<string> {
    return Buffer.from(str, 'base64').toString('binary');
  }
  async encode(str: string): Promise<string> {
    return Buffer.from(str, 'binary').toString('base64');
  }

  getTokenFromBearer(auth: string) {
    let token: string[];
    try {
      token = auth.split(' ');

      if (token.length !== 2) {
        throw new BadRequestException('Invalid authorization');
      }
      if (token[0].toLowerCase() !== 'bearer') {
        throw new BadRequestException('Invalid authorization (not is Bearer)');
      }
    } catch (e) {
      throw new Error(e);
    }

    return token[1];
  }

  async decodeToken(auth: string, returnDecoded: boolean = true, separateBearer: boolean = true): Promise<string> {
    let jwt = auth;
    if (separateBearer) jwt = await this.getTokenFromBearer(auth);
    if (returnDecoded) {
      return await this.decode(jwt);
    }
    return jwt;
  }

  async decodeData(data: string, base: string): Promise<string> {
    const toDecode: string[] = (await this.decode(data)).split(':');

    const wizardBase: string = await this.decode(base);
    const wizardMax: number = wizardBase.length;
    const decodeMax: number = toDecode.length;
    let decodePos: number = 0;
    let wizardPos: number = 0;
    let decoded: string = '';
    let num: number;
    let numw: number;
    let hex: number;
    let hexcode: string;

    while (decodePos < decodeMax) {
      num = parseInt(toDecode[decodePos]);
      numw = num - wizardBase[wizardPos].charCodeAt(0);

      num = parseInt(Math.round(num / 4).toString());
      hex = await this.resumeDigits(await this.fibonacci(num), 2);
      num = parseInt(toDecode[decodePos + 1]);
      hexcode = hex.toString(16);
      if (hex !== num || hexcode !== toDecode[decodePos + 2]) {
        throw new BadRequestException('bad encrypted');
      }
      decoded += String.fromCharCode(numw);
      wizardPos++;
      if (wizardPos == wizardMax) wizardPos = 0;

      decodePos += 3;
    }

    return decoded;
  }

  async validatePassport(passport: string, uidPassport: string): Promise<boolean> {
    const crypto = new MyCrypt(null);
    const uidd: string = await crypto.decrypt(passport);

    if (uidPassport !== uidd) return false;

    return true;
  }

  async getIv(iv: string): Promise<Buffer> {
    let ivJwt = (await this.decode(iv)).split(':');
    let arrayIv = new Array();
    ivJwt.map((n) => {
      arrayIv.push(n);
    });

    return Buffer.from(arrayIv);
  }
  async checkSqlInjection(toCheck: string) {
    const regexPreventSqlInjection =
      /(\s*([\0\b\'\"\n\r\t\%\_\\]*\s*(((select\s*.+\s*from\s*.+)|(insert\s*.+\s*into\s*.+)|(update\s*.+\s*set\s*.+)|(delete\s*.+\s*from\s*.+)|(drop\s*.+)|(truncate\s*.+)|(alter\s*.+)|(exec\s*.+)|(\s*(all|any|not|and|between|in|like|or|some|contains|containsall|containskey)\s*.+[\=\>\<=\!\~]+.+)|(let\s+.+[\=]\s*.*)|(begin\s*.*\s*end)|(\s*[\/\*]+\s*.*\s*[\*\/]+)|(\s*(\-\-)\s*.*\s+)|(\s*(contains|containsall|containskey)\s+.*)))(\s*[\;]\s*)*)+)/i;

    const sqlInjection = regexPreventSqlInjection.exec(toCheck);
    if (sqlInjection !== null) throw new ForbiddenException('Search string has illegal characters (SQL Injection)');
    // let m;

    // if ((m = preventSqlInjection.exec(toCheck)) !== null) {
    //   // The result can be accessed through the `m`-variable.
    //   m.forEach((match, groupIndex) => {
    //     console.log(`Found match, group ${groupIndex}: ${match}`);
    //   });
    // }
  }
}
