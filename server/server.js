import dotenv from "dotenv";
dotenv.config({ path: "./.env.palia" });

import express from "express";
import cors from "cors";
import { initializePool, initializeDbHost } from "./db/db_connections.js";
import apiRouter from "./routes/index.js";

async function main() {
  initializeDbHost();
  initializePool();

  const app = express();

  const FRONTEND_ORIGIN = process.env.FRONTEND_URL || "http://localhost:5173";
  const corsOptions = { origin: FRONTEND_ORIGIN };

  app.use(cors(corsOptions));

  app.use(express.json());

  const PORT = 8080;

  app.use("/palia", apiRouter);

  app.get("/palia/", (req, res) => {
    res.send("Welcome to the backend API.");
  });

  app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
    console.log(`Allowing CORS traffic from: ${FRONTEND_ORIGIN}`);
  });
}

main().catch(console.error);
