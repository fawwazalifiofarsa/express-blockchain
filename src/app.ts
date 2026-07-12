import cors from "cors";
import express from "express";
import helmet from "helmet";

import { errorHandler } from "./middleware/error-handler.js";
import { notFound } from "./middleware/not-found.js";
import apiRouter from "./routes/index.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
