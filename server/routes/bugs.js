import { Router } from "express";
import { createDB } from "../db_wiki/db_bugs.js";

const router = Router();

router.get("/", async (req, res) => {
  let db;
  try {
    db = await createDB();
  } catch {
    console.error("Database connection failed for bugs.");
    return res.status(503).json({ error: "Database service unavailable" });
  }

  const bugs = await db.getAll();
  res.json(bugs);
});

export default router;
