import { Router } from "express";

import { asyncHandler } from "../../common/utils/async-handler.js";
import { validate } from "../../middleware/validate.js";
import { login, register } from "./auth.controller.js";
import { loginSchema, registerSchema } from "./auth.validation.js";

const authRouter = Router();

authRouter.post("/login", validate({ body: loginSchema }), asyncHandler(login));

authRouter.post(
  "/register",
  validate({ body: registerSchema }),
  asyncHandler(register),
);

export default authRouter;
