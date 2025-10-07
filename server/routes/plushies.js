import { Router } from "express";
import { createDB } from "../db/db_plushies.js";

const router = Router();

router.get("/", async (req, res) => {
  let db;
  try {
    db = await createDB();
  } catch {
    console.error("Database connection failed for plushies.");
    return res.status(503).json({ error: "Database service unavailable" });
  }

  const plushies = await db.getAll();
  res.json(plushies);
});

export default router;
