import * as jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { instanceToPlain } from 'class-transformer';
config();
const SECRET = process.env.ACCESS_TOKEN_SECRET;

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