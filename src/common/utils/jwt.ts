import jwt, { type JwtPayload } from "jsonwebtoken";

import { env } from "../../config/env.js";

const TOKEN_EXPIRATION = "1h";

export function generateToken(userId: string): string {
  return jwt.sign({}, env.jwtSecret, {
    subject: userId,
    expiresIn: TOKEN_EXPIRATION,
  });
}

export function verifyToken(token: string): string {
  const payload = jwt.verify(token, env.jwtSecret) as JwtPayload;

  if (typeof payload.sub !== "string" || payload.sub.length === 0) {
    throw new Error("Token subject is missing");
  }

  return payload.sub;
}
