import type { RequestHandler } from "express";
import type { ZodType } from "zod";

import { AppError } from "../common/errors/app-error.js";

interface RequestSchemas {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
}

export function validate(schemas: RequestSchemas): RequestHandler {
  return (request, _response, next) => {
    const issues: Record<string, unknown> = {};

    for (const key of ["body", "params", "query"] as const) {
      const schema = schemas[key];

      if (!schema) {
        continue;
      }

      const result = schema.safeParse(request[key]);

      if (!result.success) {
        issues[key] = result.error.flatten();
        continue;
      }

      Object.assign(request[key], result.data);
    }

    if (Object.keys(issues).length > 0) {
      next(new AppError("Validation failed", 400, issues));
      return;
    }

    next();
  };
}
