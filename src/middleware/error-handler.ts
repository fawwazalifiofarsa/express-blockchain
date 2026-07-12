import type { ErrorRequestHandler } from "express";

import { AppError } from "../common/errors/app-error.js";
import { sendError } from "../common/utils/api-response.js";

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _request,
  response,
  _next,
) => {
  if (error instanceof AppError) {
    sendError(response, error.statusCode, error.message, error.details);
    return;
  }

  console.error(error);
  sendError(response, 500, "Internal server error");
};
