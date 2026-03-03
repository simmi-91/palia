import dotenv from "dotenv";
dotenv.config({ path: "../env/.env.palia" });

import express from "express";
import cors from "cors";
import { initializePool } from "./db/db_connections.js";
import { initDb } from "./db/initDb.js";
import apiRouter from "./routes/index.js";

async function main() {
    initializePool();
    if (process.env.DB_HOST) await initDb();

    const app = express();

    const FRONTEND_ORIGIN = process.env.FRONTEND_URL || "http://localhost:5173";
    const corsOptions = {
        origin: FRONTEND_ORIGIN,
        allowedHeaders: ["Content-Type", "Authorization"],
    };

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
