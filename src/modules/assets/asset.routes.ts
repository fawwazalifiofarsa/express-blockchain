import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.js";
import { validate } from "../../middleware/validate.js";
import { createAsset, getAssetById, getAssets } from "./asset.controller.js";
import {
  assetIdParamsSchema,
  createAssetSchema,
} from "./asset.validation.js";

const assetRouter = Router();

assetRouter.post(
  "/",
  authenticate,
  validate({ body: createAssetSchema }),
  createAsset,
);
assetRouter.get("/", getAssets);
assetRouter.get("/:id", validate({ params: assetIdParamsSchema }), getAssetById);

export default assetRouter;
