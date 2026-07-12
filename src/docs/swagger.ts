import swaggerJsdoc from "swagger-jsdoc";

import { env } from "../config/env.js";
import { commonResponses } from "./common/common.responses.js";
import { commonSchemas } from "./common/common.schemas.js";
import { healthPaths, healthSchemas } from "./paths/health.paths.js";
import { authPaths, authSchemas } from "../modules/auth/auth.swagger.js";
import { userPaths, userSchemas } from "../modules/users/user.swagger.js";

export const swaggerSpecification = swaggerJsdoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Asset Registration API",
      version: "1.0.0",
      description: "API for user authentication and asset registration workflows.",
    },
    servers: [
      {
        url: `http://localhost:${env.port}`,
        description: "Local development server",
      },
    ],
    tags: [
      { name: "Health", description: "API availability" },
      { name: "Authentication", description: "User registration and login" },
      { name: "Users", description: "Authenticated user operations" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ...commonSchemas,
        ...healthSchemas,
        ...authSchemas,
        ...userSchemas,
      },
      responses: commonResponses,
    },
    paths: {
      ...healthPaths,
      ...authPaths,
      ...userPaths,
    },
  },
  apis: [],
});
