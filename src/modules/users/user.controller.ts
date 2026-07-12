import type { Request, Response } from "express";

import { AppError } from "../../common/errors/app-error.js";
import { sendSuccess } from "../../common/utils/api-response.js";
import { userRepository } from "./user.repository.js";

export function getCurrentUser(request: Request, response: Response): void {
  const user = request.userId
    ? userRepository.findById(request.userId)
    : undefined;

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const { passwordHash: _passwordHash, ...publicUser } = user;
  sendSuccess(response, 200, "Current user retrieved", publicUser);
}
