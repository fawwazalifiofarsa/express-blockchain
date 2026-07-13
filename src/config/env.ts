import "dotenv/config";

const parsedPort = Number.parseInt(process.env.PORT ?? "3000", 10);

if (!Number.isInteger(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535");
}

const nodeEnv = process.env.NODE_ENV ?? "development";
const jwtSecret = process.env.JWT_SECRET ?? "development-only-secret-change-me";
const blockchainModeValue = process.env.BLOCKCHAIN_MODE ?? "simulated";

if (nodeEnv === "production" && !process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is required in production");
}

if (blockchainModeValue !== "simulated" && blockchainModeValue !== "real") {
  throw new Error("BLOCKCHAIN_MODE must be either simulated or real");
}

const ethereumRpcUrl = process.env.ETHEREUM_RPC_URL ?? "";
const ethereumPrivateKey = process.env.ETHEREUM_PRIVATE_KEY ?? "";
const assetRegistryContractAddress =
  process.env.ASSET_REGISTRY_CONTRACT_ADDRESS ?? "";

if (blockchainModeValue === "real") {
  const missingConfiguration = [
    ["ETHEREUM_RPC_URL", ethereumRpcUrl],
    ["ETHEREUM_PRIVATE_KEY", ethereumPrivateKey],
    ["ASSET_REGISTRY_CONTRACT_ADDRESS", assetRegistryContractAddress],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missingConfiguration.length > 0) {
    throw new Error(
      `Missing blockchain configuration for real mode: ${missingConfiguration.join(", ")}`,
    );
  }

  if (!/^0x[a-fA-F0-9]{64}$/.test(ethereumPrivateKey)) {
    throw new Error("ETHEREUM_PRIVATE_KEY must be a 32-byte hexadecimal key");
  }

  if (!/^0x[a-fA-F0-9]{40}$/.test(assetRegistryContractAddress)) {
    throw new Error(
      "ASSET_REGISTRY_CONTRACT_ADDRESS must be a 20-byte hexadecimal address",
    );
  }
}

export const env = {
  nodeEnv,
  port: parsedPort,
  jwtSecret,
  blockchainMode: blockchainModeValue,
  ethereumRpcUrl,
  ethereumPrivateKey,
  assetRegistryContractAddress,
} as const;
