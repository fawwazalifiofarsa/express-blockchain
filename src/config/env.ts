import "dotenv/config";

const parsedPort = Number.parseInt(process.env.PORT ?? "3000", 10);

if (!Number.isInteger(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535");
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: parsedPort,
} as const;
