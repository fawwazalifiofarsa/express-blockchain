import { memoryDatabase } from "../../database/memory.database.js";
import type { Asset } from "./asset.types.js";

export class AssetRepository {
  create(asset: Asset): Asset {
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
