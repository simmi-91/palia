import { Router } from "express";
import { createDB } from "../db_wiki/db_potato_pods.js";

const router = Router();

router.get("/", async (req, res) => {
  let db;
  try {
    db = await createDB();
  } catch {
    console.error("Database connection failed for potato pods.");
    return res.status(503).json({ error: "Database service unavailable" });
  }

  const pods = await db.getAll();
  res.json(pods);
});

export default router;
