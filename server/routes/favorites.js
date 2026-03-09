import { Router } from "express";
import { createDB } from "../db/db_favorites.js";

const router = Router();

/**
 * @swagger
 * /favorites/{profileId}:
 *   get:
 *     summary: Get all favorites for a user
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: profileId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of favorites
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FavoriteItem'
 *       503:
 *         description: Database service unavailable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Add a favorite
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: profileId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [category, itemId]
 *             properties:
 *               category: { type: string }
 *               itemId: { type: integer }
 *     responses:
 *       201:
 *         description: Favorite added
 *       503:
 *         description: Database service unavailable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Remove a favorite
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: profileId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [favoriteId]
 *             properties:
 *               favoriteId: { type: integer }
 *     responses:
 *       200:
 *         description: Favorite removed
 *       503:
 *         description: Database service unavailable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

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
