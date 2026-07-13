import type { Request, Response } from "express";

import { AppError } from "../../common/errors/app-error.js";
import { sendSuccess } from "../../common/utils/api-response.js";
import { assetService } from "./asset.service.js";
import type {
  AssetIdParams,
  CreateAssetRequest,
} from "./asset.validation.js";

export function createAsset(
  request: Request<object, object, CreateAssetRequest>,
  response: Response,
): Promise<void> {
  if (!request.userId) {
    throw new AppError("Authentication required", 401);
  }

  return assetService.create(request.body, request.userId).then((asset) => {
    sendSuccess(response, 201, "Asset registered successfully", asset);
  });
}

export function getAssets(_request: Request, response: Response): void {
  sendSuccess(response, 200, "Assets retrieved successfully", assetService.getAll());
}

export function getAssetById(
  request: Request<AssetIdParams>,
  response: Response,
): void {
  sendSuccess(
    response,
    200,
    "Asset retrieved successfully",
    assetService.getById(request.params.id),
  );
}
