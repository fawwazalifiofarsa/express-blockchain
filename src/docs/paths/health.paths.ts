export const healthSchemas = {
  HealthResponse: {
    type: "object",
    additionalProperties: false,
    required: ["success", "message"],
    properties: {
      success: { type: "boolean", enum: [true] },
      message: { type: "string", enum: ["Asset Registration API is running"] },
    },
  },
} as const;

export const healthPaths = {
  "/api/health": {
    get: {
      tags: ["Health"],
      summary: "Check API health",
      description: "Confirms that the Asset Registration API process is running.",
      responses: {
        "200": {
          description: "The API is running.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/HealthResponse" },
              example: {
                success: true,
                message: "Asset Registration API is running",
              },
            },
          },
        },
      },
    },
  },
} as const;
