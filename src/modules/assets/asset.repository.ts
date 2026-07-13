import { generateId } from "../../common/utils/generate-id.js";
import { memoryDatabase } from "../../database/memory.database.js";
import type { Asset, CreateAssetInput } from "./asset.types.js";

export class AssetRepository {
  create(input: CreateAssetInput, ownerId: string): Asset {
    const asset: Asset = {
      id: generateId(),
      ...input,
      ownerId,
      createdAt: new Date().toISOString(),
    };

    memoryDatabase.assets.push(asset);
    return asset;
  }

  findAll(): Asset[] {
    return [...memoryDatabase.assets];
  }

  findById(id: string): Asset | undefined {
    return memoryDatabase.assets.find((asset) => asset.id === id);
  }
}

export const assetRepository = new AssetRepository();
