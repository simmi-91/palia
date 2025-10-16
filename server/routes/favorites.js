import { Router } from "express";
import { createDB } from "../db/db_favorites.js";

const router = Router();

router.get("/:profileId", async (req, res) => {
  const { profileId } = req.params;
  let db;
  try {
    db = await createDB();
  } catch {
    console.error("Database connection failed for favorites.");
    return res.status(503).json({ error: "Database service unavailable" });
  }

  const favorites = await db.getAll(profileId);
  res.json(favorites);
});

router.post("/:profileId", async (req, res) => {
  const { profileId } = req.params;
  const { category, itemId } = req.body;
  let db;
  try {
    db = await createDB();
  } catch {
    console.error("Database connection failed for favorites.");
    return res.status(503).json({ error: "Database service unavailable" });
  }

  const newFavorite = { profileId, category, itemId };
  const result = await db.addFavorite(newFavorite);
  res.json(result);
});

router.delete("/:profileId", async (req, res) => {
  const { profileId } = req.params;
  const { favoriteId } = req.body;
  let db;
  try {
    db = await createDB();
  } catch {
    console.error("Database connection failed for favorites.");
    return res.status(503).json({ error: "Database service unavailable" });
  }

  const result = await db.removeFavorite(favoriteId, profileId);
  res.json(result);
});

export default router;
