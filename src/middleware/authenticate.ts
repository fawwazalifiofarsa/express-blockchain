import type { RequestHandler } from "express";

import { AppError } from "../common/errors/app-error.js";
import { verifyToken } from "../common/utils/jwt.js";
import { userRepository } from "../modules/users/user.repository.js";

export const authenticate: RequestHandler = (request, _response, next) => {
  const authorization = request.headers.authorization;
  const [scheme, token] = authorization?.split(" ") ?? [];

  if (scheme !== "Bearer" || !token) {
    next(new AppError("Authentication required", 401));
    return;
  }

  try {
    const userId = verifyToken(token);

    if (!userRepository.findById(userId)) {
      next(new AppError("Invalid or expired token", 401));
      return;
    }

    request.userId = userId;
    next();
  } catch {
    next(new AppError("Invalid or expired token", 401));
  }
};
