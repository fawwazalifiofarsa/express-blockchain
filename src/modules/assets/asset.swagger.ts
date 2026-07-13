export const assetSchemas = {
  Asset: {
    type: "object",
    additionalProperties: false,
    required: ["id", "name", "metadata", "ownerId", "createdAt"],
    properties: {
      id: { type: "string", format: "uuid" },
      name: { type: "string", minLength: 1, maxLength: 100 },
      description: { type: "string", minLength: 1, maxLength: 1_000 },
      metadata: { type: "object", additionalProperties: true },
      ownerId: { type: "string", format: "uuid" },
      createdAt: { type: "string", format: "date-time" },
    },
  },
  CreateAssetRequest: {
    type: "object",
    additionalProperties: false,
    required: ["name", "metadata"],
    properties: {
      name: {
        type: "string",
        minLength: 1,
        maxLength: 100,
        description: "Leading and trailing whitespace is removed.",
      },
      description: {
        type: "string",
        minLength: 1,
        maxLength: 1_000,
        description: "Leading and trailing whitespace is removed when provided.",
      },
      metadata: { type: "object", additionalProperties: true },
    },
  },
  AssetResponse: {
    type: "object",
    additionalProperties: false,
    required: ["success", "message", "data"],
    properties: {
      success: { type: "boolean", enum: [true] },
      message: { type: "string" },
      data: { $ref: "#/components/schemas/Asset" },
    },
  },
  AssetListResponse: {
    type: "object",
    additionalProperties: false,
    required: ["success", "message", "data"],
    properties: {
      success: { type: "boolean", enum: [true] },
      message: { type: "string", enum: ["Assets retrieved successfully"] },
      data: {
        type: "array",
        items: { $ref: "#/components/schemas/Asset" },
      },
    },
  },
} as const;

export const assetResponses = {
  AssetNotFound: {
    description: "No asset exists with the supplied ID.",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/ErrorResponse" },
        example: { success: false, message: "Asset not found" },
      },
    },
  },
} as const;

export const assetPaths = {
  "/api/assets": {
    post: {
      tags: ["Assets"],
      summary: "Register an asset",
      description: "Registers an asset owned by the user identified by the JWT. The owner cannot be supplied in the request body.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateAssetRequest" },
          },
        },
      },
      responses: {
        "201": {
          description: "Asset registered successfully.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AssetResponse" },
              example: {
                success: true,
                message: "Asset registered successfully",
                data: {
                  id: "8ef86cf9-f747-4f88-bbf2-6eeea1544636",
                  name: "Warehouse Certificate",
                  metadata: { location: "Jakarta" },
                  ownerId: "4cb7df9d-7196-439d-a927-a1fa69dd92e5",
                  createdAt: "2026-07-13T00:00:00.000Z",
                },
              },
            },
          },
        },
        "400": { $ref: "#/components/responses/ValidationError" },
        "401": {
          description: "Authentication is missing, or the JWT is invalid or expired.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              examples: {
                missingToken: {
                  value: { success: false, message: "Authentication required" },
                },
                invalidOrExpiredToken: {
                  value: { success: false, message: "Invalid or expired token" },
                },
              },
            },
          },
        },
        "500": { $ref: "#/components/responses/InternalServerError" },
      },
    },
    get: {
      tags: ["Assets"],
      summary: "List all assets",
      responses: {
        "200": {
          description: "All assets were retrieved.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AssetListResponse" },
            },
          },
        },
        "500": { $ref: "#/components/responses/InternalServerError" },
      },
    },
  },
  "/api/assets/{id}": {
    get: {
      tags: ["Assets"],
      summary: "Get an asset by ID",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
        },
      ],
      responses: {
        "200": {
          description: "The asset was retrieved.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AssetResponse" },
              example: {
                success: true,
                message: "Asset retrieved successfully",
                data: {
                  id: "8ef86cf9-f747-4f88-bbf2-6eeea1544636",
                  name: "Warehouse Certificate",
                  metadata: { location: "Jakarta" },
                  ownerId: "4cb7df9d-7196-439d-a927-a1fa69dd92e5",
                  createdAt: "2026-07-13T00:00:00.000Z",
                },
              },
            },
          },
        },
        "400": { $ref: "#/components/responses/ValidationError" },
        "404": { $ref: "#/components/responses/AssetNotFound" },
        "500": { $ref: "#/components/responses/InternalServerError" },
      },
    },
  },
} as const;
