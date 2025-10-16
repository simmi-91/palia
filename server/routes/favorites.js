import { Router } from "express";
import { createDB } from "../db/db_favorites.js";

const router = Router();

router.get("/", async (req, res) => {
  const { user_id: bodyUserId } = req.body || {};
  const { user_id: queryUserId } = req.query || {};
  const user_id = bodyUserId ?? queryUserId;
  let db;
  try {
    db = await createDB();
  } catch {
    console.error("Database connection failed for favorites.");
    return res.status(503).json({ error: "Database service unavailable" });
  }

  const favorites = await db.getAll(user_id);
  res.json(favorites);
});

router.post("/", async (req, res) => {
  const { user_id, category, item_id } = req.body;
  let db;
  try {
    db = await createDB();
  } catch {
    console.error("Database connection failed for favorites.");
    return res.status(503).json({ error: "Database service unavailable" });
  }

  const newFavorite = { user_id, category, item_id };
  const result = await db.addFavorite(newFavorite);
  res.json(result);
});

router.delete("/", async (req, res) => {
  const { user_id, favorite_id } = req.body;
  let db;
  try {
    db = await createDB();
  } catch {
    console.error("Database connection failed for favorites.");
    return res.status(503).json({ error: "Database service unavailable" });
  }

  const result = await db.removeFavorite(favorite_id, user_id);
  res.json(result);
});

export default router;
