import express from "express";
import cors from "cors";

import { initializeDatabases } from "./db/index.js";
import apiRouter from "./routes/index.js";

async function main() {
  await initializeDatabases();
  const app = express();

  const corsOptions = { origin: "http://localhost:5173" };
  app.use(cors(corsOptions));

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
