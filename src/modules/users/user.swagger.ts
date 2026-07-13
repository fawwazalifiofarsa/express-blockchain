export const userSchemas = {
  PublicUser: {
    type: "object",
    additionalProperties: false,
    required: ["id", "name", "email", "createdAt"],
    properties: {
      id: { type: "string", format: "uuid" },
      name: { type: "string", minLength: 2, maxLength: 100 },
      email: { type: "string", format: "email" },
      createdAt: { type: "string", format: "date-time" },
    },
  },
  CurrentUserResponse: {
    type: "object",
    additionalProperties: false,
    required: ["success", "message", "data"],
    properties: {
      success: { type: "boolean", enum: [true] },
      message: { type: "string", enum: ["Current user retrieved"] },
      data: { $ref: "#/components/schemas/PublicUser" },
    },
  },
} as const;

export const userResponses = {
  UserNotFound: {
    description: "The authenticated user could not be found.",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/ErrorResponse" },
        example: { success: false, message: "User not found" },
      },
    },
  },
} as const;

export const userPaths = {
  "/api/users/me": {
    get: {
      tags: ["Users"],
      summary: "Get the current user",
      security: [{ bearerAuth: [] }],
      responses: {
        "200": {
          description: "The authenticated user was retrieved.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CurrentUserResponse" },
            },
          },
        },
        "401": {
          description: "Authentication is missing, or the JWT is invalid or expired.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              examples: {
                missingToken: {
                  summary: "Missing or malformed authorization header",
                  value: { success: false, message: "Authentication required" },
                },
                invalidOrExpiredToken: {
                  summary: "Invalid or expired JWT",
                  value: { success: false, message: "Invalid or expired token" },
                },
              },
            },
          },
        },
        "404": { $ref: "#/components/responses/UserNotFound" },
        "500": { $ref: "#/components/responses/InternalServerError" },
      },
    },
  },
} as const;
