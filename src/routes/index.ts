import { Router } from "express";

const apiRouter = Router();

apiRouter.get("/health", (_request, response) => {
  response.status(200).json({
    success: true,
    message: "Asset Registration API is running",
  });
});

export default apiRouter;
