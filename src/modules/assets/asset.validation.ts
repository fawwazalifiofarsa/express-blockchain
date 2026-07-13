import { z } from "zod";

export const createAssetSchema = z
  .object({
    name: z.string().trim().min(1).max(100),
    description: z.string().trim().min(1).max(1_000).optional(),
    metadata: z.record(z.string(), z.unknown()),
  })
  .strict();

export const assetIdParamsSchema = z.object({
  id: z.uuid(),
});

export type CreateAssetRequest = z.infer<typeof createAssetSchema>;
export type AssetIdParams = z.infer<typeof assetIdParamsSchema>;
