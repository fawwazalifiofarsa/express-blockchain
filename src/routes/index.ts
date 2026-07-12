import { Router } from "express";

import { sendSuccess } from "../common/utils/api-response.js";
import authRouter from "../modules/auth/auth.routes.js";
import userRouter from "../modules/users/user.routes.js";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);

apiRouter.get("/health", (_request, response) => {
  sendSuccess(response, 200, "Asset Registration API is running");
});

export default apiRouter;
