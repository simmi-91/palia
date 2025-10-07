import { Router } from "express";
import { createDB } from "../db/db_artifacts.js";

const router = Router();

router.get("/", async (req, res) => {
  let db;
  try {
    db = await createDB();
  } catch {
    console.error("Database connection failed for artifacts.");
    return res.status(503).json({ error: "Database service unavailable" });
  }

  const artifacts = await db.getAll();
  res.json(artifacts);
});

export default router;
