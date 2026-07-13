import { AppError } from "../../common/errors/app-error.js";
import {
  assetRepository,
  type AssetRepository,
} from "./asset.repository.js";
import type { Asset } from "./asset.types.js";
import type { CreateAssetRequest } from "./asset.validation.js";

export class AssetService {
  constructor(private readonly assets: AssetRepository = assetRepository) {}

  create(input: CreateAssetRequest, ownerId: string): Asset {
    return this.assets.create(input, ownerId);
  }

  getAll(): Asset[] {
    return this.assets.findAll();
  }

  getById(id: string): Asset {
    const asset = this.assets.findById(id);

    if (!asset) {
      throw new AppError("Asset not found", 404);
    }

    return asset;
  }
}

export const assetService = new AssetService();
