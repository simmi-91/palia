import { Router } from "express";
import { createDB } from "../db/db_links.js";

const router = Router();

router.get("/", async (req, res) => {
  let db;
  try {
    db = await createDB();
  } catch {
    console.error("Database connection failed for links.");
    return res.status(503).json({ error: "Database service unavailable" });
  }

  const links = await db.getAllLinks();
  res.json(links);
});

export default router;
