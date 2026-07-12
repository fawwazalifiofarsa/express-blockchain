import type { Response } from "express";

export interface ApiSuccessResponse<T = undefined> {
  success: true;
  message: string;
  data?: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: unknown;
}

export function sendSuccess<T>(
  response: Response,
  statusCode: number,
  message: string,
  data?: T,
): Response<ApiSuccessResponse<T>> {
  return response.status(statusCode).json({
    success: true,
    message,
    ...(data === undefined ? {} : { data }),
  });
}

export function sendError(
  response: Response,
  statusCode: number,
  message: string,
  errors?: unknown,
): Response<ApiErrorResponse> {
  return response.status(statusCode).json({
    success: false,
    message,
    ...(errors === undefined ? {} : { errors }),
  });
}
