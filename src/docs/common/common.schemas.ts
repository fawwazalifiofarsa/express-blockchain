export const commonSchemas = {
  ErrorResponse: {
    type: "object",
    additionalProperties: false,
    required: ["success", "message"],
    properties: {
      success: { type: "boolean", enum: [false] },
      message: { type: "string" },
    },
  },
  ValidationErrorResponse: {
    type: "object",
    additionalProperties: false,
    required: ["success", "message", "errors"],
    properties: {
      success: { type: "boolean", enum: [false] },
      message: { type: "string", enum: ["Validation failed"] },
      errors: {
        type: "object",
        additionalProperties: false,
        properties: {
          body: { $ref: "#/components/schemas/ValidationIssues" },
          params: { $ref: "#/components/schemas/ValidationIssues" },
          query: { $ref: "#/components/schemas/ValidationIssues" },
        },
      },
    },
  },
  ValidationIssues: {
    type: "object",
    additionalProperties: false,
    required: ["formErrors", "fieldErrors"],
    properties: {
      formErrors: { type: "array", items: { type: "string" } },
      fieldErrors: {
        type: "object",
        additionalProperties: {
          type: "array",
          items: { type: "string" },
        },
      },
    },
  },
} as const;
