import { Router } from "express";
import { createDB } from "../db_wiki/db_stickers.js";

const router = Router();

router.get("/", async (req, res) => {
  let db;
  try {
    db = await createDB();
  } catch {
    console.error("Database connection failed for stickers.");
    return res.status(503).json({ error: "Database service unavailable" });
  }

  const stickers = await db.getAll();
  res.json(stickers);
});

export default router;
