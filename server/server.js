import express from "express";
import cors from "cors";

import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "../.env.palia"),
});

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
