import { MyCrypto } from '@common/interfaces';
import * as crypt from 'crypto';

export class MyCrypt {
  private readonly ivLength = 16;
  private readonly saltLength = 64;
  private readonly tagLength = 16;
  private readonly tagPosition = this.saltLength + this.ivLength;
  private readonly encryptedPosition = this.tagPosition + this.tagLength;
  private config: MyCrypto;
  public error: string = '';

  constructor({
    algorithm = <crypt.CipherGCMTypes>process.env.BACK_ALGORITHM_TYPE,
    secret = process.env.BACK_ALGORITHM_SECRET,
    keyLen = +process.env.BACK_ALGORITHM_KEY,
  }: Partial<MyCrypto>) {
    this.config = { algorithm, secret, keyLen };
  }

  async getKey(salt: Buffer): Promise<Buffer> {
    return crypt.pbkdf2Sync(this.config.secret, salt, 100000, this.config.keyLen, 'sha512');
  }

  async encrypt(value: string): Promise<string> {
    if (!value) {
      throw new Error('encrypt: value must not be null or undefined');
    }

    const iv: Buffer = crypt.randomBytes(this.ivLength);
    const salt: Buffer = crypt.randomBytes(this.saltLength);
    const key: Buffer = await this.getKey(salt);

    const cipher: crypt.CipherGCM = crypt.createCipheriv(this.config.algorithm, key, iv);
    const encrypted: Buffer = Buffer.concat([cipher.update(String(value), 'utf8'), cipher.final()]);

    const tag: Buffer = cipher.getAuthTag();

    return Buffer.concat([salt, iv, tag, encrypted]).toString('hex');
  }

  async decrypt(value: string): Promise<string> {
    if (!value) {
      throw new Error('value must not be null or undefined');
    }

    const stringValue: Buffer = Buffer.from(String(value), 'hex');
    const salt: Buffer = stringValue.slice(0, this.saltLength);
    const iv: Buffer = stringValue.slice(this.saltLength, this.tagPosition);
    const tag: Buffer = stringValue.slice(this.tagPosition, this.encryptedPosition);
    const encrypted: Buffer = stringValue.slice(this.encryptedPosition);
    const key: Buffer = await this.getKey(salt);

    const decipher: crypt.DecipherGCM = crypt.createDecipheriv(this.config.algorithm, key, iv);

    decipher.setAuthTag(tag);

    return decipher.update(encrypted) + decipher.final('utf8');
  }
}
