import { AppError } from "../../common/errors/app-error.js";
import {
  assetRegistryService,
  type AssetRegistryService,
} from "../../blockchain/asset-registry.service.js";
import { generateId } from "../../common/utils/generate-id.js";
import {
  assetRepository,
  type AssetRepository,
} from "./asset.repository.js";
import type { Asset } from "./asset.types.js";
import type { CreateAssetRequest } from "./asset.validation.js";

export class AssetService {
  constructor(
    private readonly assets: AssetRepository = assetRepository,
    private readonly registry: AssetRegistryService = assetRegistryService,
  ) {}

  async create(input: CreateAssetRequest, ownerId: string): Promise<Asset> {
    const id = generateId();
    const asset: Asset = {
      id,
      ...input,
      ...(await this.registry.register(id, input.metadata)),
      ownerId,
      createdAt: new Date().toISOString(),
    };

    return this.assets.create(asset);
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
