import * as jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { instanceToPlain } from 'class-transformer';
config();
const SECRET = process.env.ACCESS_TOKEN_SECRET;
import { AES, enc } from 'crypto-js';

export function encodeJwt(obj: object) {
  return jwt.sign(instanceToPlain(obj), SECRET);
}

export function verifyJwt(token: string): boolean {
  try {
    jwt.verify(token, SECRET);
    return true;
  } catch (e) {
    return false;
  }
}
export function decodeToken(token: string) {
  return jwt.decode(token);
}

const HASH_SEPARATOR = '___';

export function decodePhoneCode(hash: string): number | null {
  const bytes = AES.decrypt(hash, process.env.PHONE_CODE_SECRET_KEY);
  const result = bytes.toString(enc.Utf8);
  if (!result) {
    return null;
  }
  const [prefix, phoneCode] = result.split(HASH_SEPARATOR);
  return phoneCode;
}

export function encodePhoneCode(code: number): string {
  return AES.encrypt(
    `PHONE_CODE${HASH_SEPARATOR}${code}`,
    process.env.PHONE_CODE_SECRET_KEY,
  ).toString();
}
