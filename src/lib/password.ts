// src/lib/password.ts
import { hash, verify } from "argon2";
export const hashPassword = (plain: string) => hash(plain);
export const verifyPassword = (hashStr: string, plain: string) =>
  verify(hashStr, plain);
