import { randomBytes } from "node:crypto";
import { Contract, JsonRpcProvider, Wallet } from "ethers";

import { generateMetadataHash } from "../common/utils/metadata-hash.js";
import { env } from "../config/env.js";
import type { BlockchainStatus } from "../modules/assets/asset.types.js";
import { assetRegistryAbi } from "./asset-registry.abi.js";

interface BlockchainRegistration {
  metadataHash: string;
  transactionHash: string;
  blockchainStatus: BlockchainStatus;
}

export class AssetRegistryService {
  private readonly contract?: Contract;

  constructor() {
    if (env.blockchainMode === "real") {
      const provider = new JsonRpcProvider(env.ethereumRpcUrl);
      const wallet = new Wallet(env.ethereumPrivateKey, provider);
      this.contract = new Contract(
        env.assetRegistryContractAddress,
        assetRegistryAbi,
        wallet,
      );
    }
  }

  async register(
    assetId: string,
    metadata: Record<string, unknown>,
  ): Promise<BlockchainRegistration> {
    const metadataHash = generateMetadataHash(metadata);

    if (env.blockchainMode === "simulated") {
      return {
        metadataHash,
        transactionHash: `0x${randomBytes(32).toString("hex")}`,
        blockchainStatus: "registered",
      };
    }

    if (!this.contract) {
      throw new Error("Asset registry contract is not configured");
    }

    const transaction = await this.contract.registerAsset(assetId, metadataHash);
    const receipt = await transaction.wait();

    if (!receipt) {
      throw new Error("Ethereum transaction was not confirmed");
    }

    return {
      metadataHash,
      transactionHash: receipt.hash,
      blockchainStatus: "registered",
    };
  }
}

export const assetRegistryService = new AssetRegistryService();
