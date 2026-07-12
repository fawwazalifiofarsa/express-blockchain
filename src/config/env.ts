import "dotenv/config";

const parsedPort = Number.parseInt(process.env.PORT ?? "3000", 10);

if (!Number.isInteger(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535");
}

const nodeEnv = process.env.NODE_ENV ?? "development";
const jwtSecret = process.env.JWT_SECRET ?? "development-only-secret-change-me";

if (nodeEnv === "production" && !process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is required in production");
}

export const env = {
  nodeEnv,
  port: parsedPort,
  jwtSecret,
} as const;
