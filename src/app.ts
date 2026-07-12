import cors from "cors";
import express from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";

import { swaggerSpecification } from "./docs/swagger.js";
import { errorHandler } from "./middleware/error-handler.js";
import { notFound } from "./middleware/not-found.js";
import apiRouter from "./routes/index.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/api/docs.json", (_request, response) => {
  response.status(200).json(swaggerSpecification);
});
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpecification),
);

app.use("/api", apiRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
