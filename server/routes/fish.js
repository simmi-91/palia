import { Router } from "express";
import { createDB } from "../db_wiki/db_fish.js";

const router = Router();

router.get("/", async (req, res) => {
  let db;
  try {
    db = await createDB();
  } catch {
    console.error("Database connection failed for fish.");
    return res.status(503).json({ error: "Database service unavailable" });
  }

  const fish = await db.getAll();
  res.json(fish);
});

export default router;
