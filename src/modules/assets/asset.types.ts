export interface Asset {
  id: string;
  name: string;
  description?: string;
  metadata: Record<string, unknown>;
  ownerId: string;
  createdAt: string;
}

export type CreateAssetInput = Omit<Asset, "id" | "createdAt" | "ownerId">;
