import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.js";
import { getCurrentUser } from "./user.controller.js";

const userRouter = Router();

userRouter.get("/me", authenticate, getCurrentUser);

export default userRouter;
