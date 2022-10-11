import * as crypt from 'crypto';

export interface MyCrypto {
  algorithm: crypt.CipherGCMTypes;
  secret: crypt.BinaryLike;
  keyLen: number;
}
