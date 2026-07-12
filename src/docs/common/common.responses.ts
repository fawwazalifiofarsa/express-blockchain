const errorContent = (message: string) => ({
  "application/json": {
    schema: { $ref: "#/components/schemas/ErrorResponse" },
    example: { success: false, message },
  },
});

export const commonResponses = {
  ValidationError: {
    description: "Request validation failed.",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/ValidationErrorResponse" },
      },
    },
  },
  DuplicateEmail: {
    description: "The normalized email address is already registered.",
    content: errorContent("Email is already registered"),
  },
  InvalidCredentials: {
    description: "The email or password is incorrect.",
    content: errorContent("Invalid email or password"),
  },
  AuthenticationRequired: {
    description: "The Authorization header is missing or is not a Bearer token.",
    content: errorContent("Authentication required"),
  },
  InvalidOrExpiredToken: {
    description: "The JWT is invalid, expired, or belongs to a user that no longer exists.",
    content: errorContent("Invalid or expired token"),
  },
  UserNotFound: {
    description: "The authenticated user could not be found.",
    content: errorContent("User not found"),
  },
  InternalServerError: {
    description: "An unexpected server error occurred.",
    content: errorContent("Internal server error"),
  },
} as const;
