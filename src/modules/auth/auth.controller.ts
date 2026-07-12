import type { Request, Response } from "express";

import { sendSuccess } from "../../common/utils/api-response.js";
import { authService } from "./auth.service.js";
import type { LoginInput, RegisterInput } from "./auth.validation.js";

export async function register(
  request: Request<object, object, RegisterInput>,
  response: Response,
): Promise<void> {
  const user = await authService.register(request.body);
  sendSuccess(response, 201, "User registered successfully", user);
}

export async function login(
  request: Request<object, object, LoginInput>,
  response: Response,
): Promise<void> {
  const result = await authService.login(request.body);
  sendSuccess(response, 200, "Login successful", result);
}
