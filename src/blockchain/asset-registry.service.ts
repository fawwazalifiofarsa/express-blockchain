import { randomBytes } from "node:crypto";

import { generateMetadataHash } from "../common/utils/metadata-hash.js";
import type { BlockchainStatus } from "../modules/assets/asset.types.js";

interface BlockchainRegistration {
  metadataHash: string;
  transactionHash: string;
  blockchainStatus: BlockchainStatus;
}

export class AssetRegistryService {
  register(metadata: Record<string, unknown>): BlockchainRegistration {
    return {
      metadataHash: generateMetadataHash(metadata),
      transactionHash: `0x${randomBytes(32).toString("hex")}`,
      blockchainStatus: "registered",
    };
  }
}

export const assetRegistryService = new AssetRegistryService();
