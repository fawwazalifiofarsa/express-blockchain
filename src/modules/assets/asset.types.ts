export type BlockchainStatus = "registered" | "failed";

export interface Asset {
  id: string;
  name: string;
  description?: string;
  metadata: Record<string, unknown>;
  metadataHash: string;
  transactionHash: string;
  blockchainStatus: BlockchainStatus;
  ownerId: string;
  createdAt: string;
}
