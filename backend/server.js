import express from "express";
import cors from "cors";
import "dotenv/config";

import apiRouter from "./routes/index.js";

async function main() {
  const app = express();

  const FRONTEND_ORIGIN = process.env.FRONTEND_URL || "http://localhost:5173";
  const corsOptions = { origin: FRONTEND_ORIGIN };
  app.use(cors(corsOptions));

  app.use(express.json());

  const PORT = 8080;

  app.use("/api", apiRouter);

  app.get("/", (req, res) => {
    res.send("Welcome to the backend API.");
  });

  app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
  });
}

main().catch(console.error);
