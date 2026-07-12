export const authSchemas = {
  RegisterRequest: {
    type: "object",
    additionalProperties: false,
    required: ["name", "email", "password"],
    properties: {
      name: {
        type: "string",
        minLength: 2,
        maxLength: 100,
        description: "Leading and trailing whitespace is removed.",
      },
      email: {
        type: "string",
        format: "email",
        description: "Leading and trailing whitespace is removed and the value is normalized to lowercase.",
      },
      password: {
        type: "string",
        format: "password",
        minLength: 8,
        maxLength: 72,
        pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).+$",
        description: "Must contain a lowercase letter, uppercase letter, number, and special character.",
      },
    },
  },
  LoginRequest: {
    type: "object",
    additionalProperties: false,
    required: ["email", "password"],
    properties: {
      email: {
        type: "string",
        format: "email",
        description: "Leading and trailing whitespace is removed and the value is normalized to lowercase.",
      },
      password: {
        type: "string",
        format: "password",
        minLength: 1,
        maxLength: 72,
      },
    },
  },
  RegisterResponse: {
    type: "object",
    additionalProperties: false,
    required: ["success", "message", "data"],
    properties: {
      success: { type: "boolean", enum: [true] },
      message: { type: "string", enum: ["User registered successfully"] },
      data: { $ref: "#/components/schemas/PublicUser" },
    },
  },
  LoginResponse: {
    type: "object",
    additionalProperties: false,
    required: ["success", "message", "data"],
    properties: {
      success: { type: "boolean", enum: [true] },
      message: { type: "string", enum: ["Login successful"] },
      data: {
        type: "object",
        additionalProperties: false,
        required: ["token", "user"],
        properties: {
          token: { type: "string", description: "JWT bearer token valid for one hour." },
          user: { $ref: "#/components/schemas/PublicUser" },
        },
      },
    },
  },
} as const;

export const authPaths = {
  "/api/auth/register": {
    post: {
      tags: ["Authentication"],
      summary: "Register a user",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/RegisterRequest" },
          },
        },
      },
      responses: {
        "201": {
          description: "User registered successfully.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterResponse" },
            },
          },
        },
        "400": { $ref: "#/components/responses/ValidationError" },
        "409": { $ref: "#/components/responses/DuplicateEmail" },
        "500": { $ref: "#/components/responses/InternalServerError" },
      },
    },
  },
  "/api/auth/login": {
    post: {
      tags: ["Authentication"],
      summary: "Log in",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/LoginRequest" },
          },
        },
      },
      responses: {
        "200": {
          description: "Login successful.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginResponse" },
            },
          },
        },
        "400": { $ref: "#/components/responses/ValidationError" },
        "401": { $ref: "#/components/responses/InvalidCredentials" },
        "500": { $ref: "#/components/responses/InternalServerError" },
      },
    },
  },
} as const;
