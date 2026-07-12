import { Router } from "express";

import { sendSuccess } from "../common/utils/api-response.js";

const apiRouter = Router();

apiRouter.get("/health", (_request, response) => {
  sendSuccess(response, 200, "Asset Registration API is running");
});

export default apiRouter;
