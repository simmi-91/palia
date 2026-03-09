import { Router } from "express";
import { createDB } from "../db/db_inventory.js";

const router = Router();

/**
 * @swagger
 * /inventory/{profileId}:
 *   get:
 *     summary: Get all inventory items for a user
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: profileId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of inventory items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InventoryItem'
 *       503:
 *         description: Database service unavailable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /inventory/tradeable/{profileId}:
 *   get:
 *     summary: Get tradeable inventory items (amount > 1) for all other users
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: profileId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of tradeable items from other users
 *       503:
 *         description: Database service unavailable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /inventory:
 *   post:
 *     summary: Update a single inventory item
 *     tags: [Inventory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [profileId, category, itemId, amount]
 *             properties:
 *               profileId: { type: string }
 *               category: { type: string }
 *               itemId: { type: integer }
 *               amount: { type: integer }
 *     responses:
 *       200:
 *         description: Inventory updated
 *       400:
 *         description: Bad request – missing or invalid fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       503:
 *         description: Database service unavailable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /inventory/bulk-update:
 *   post:
 *     summary: Bulk update inventory items
 *     tags: [Inventory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [profileId, items]
 *             properties:
 *               profileId: { type: string }
 *               items:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/InventoryItem'
 *     responses:
 *       200:
 *         description: Bulk update successful
 *       400:
 *         description: Bad request – missing or invalid fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
    console.error("Database connection failed for inventory.");
    return res.status(503).json({ error: "Database service unavailable" });
  }

  const data = await db.getAll(profileId);
  res.json(data);
});

router.get("/tradeable/:profileId", async (req, res) => {
  const { profileId } = req.params;
  let db;
  try {
    db = await createDB();
  } catch {
    console.error("Database connection failed for inventory.");
    return res.status(503).json({ error: "Database service unavailable" });
  }

  const data = await db.getTradeable(profileId);
  res.json(data);
});

router.post("/", async (req, res) => {
  const { profileId, category, itemId, amount } = req.body;
  if (
    !profileId ||
    category === undefined ||
    itemId === undefined ||
    amount === undefined
  ) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  let db;
  try {
    db = await createDB();
  } catch {
    console.error("Database connection failed for inventory.");
    return res.status(503).json({ error: "Database service unavailable" });
  }

  try {
    const data = await db.update(profileId, category, itemId, amount);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error updating inventory:", error);
    return res.status(500).json({ error: "Failed to update inventory." });
  }
});

router.post("/bulk-update", async (req, res) => {
  const { profileId, items } = req.body;
  if (!profileId || !Array.isArray(items)) {
    return res
      .status(400)
      .json({ error: "Missing required fields or invalid format." });
  }

  let db;
  try {
    db = await createDB();
  } catch {
    console.error("Database connection failed for bulk update.");
    return res.status(503).json({ error: "Database service unavailable" });
  }

  try {
    const data = await db.bulkUpdate(profileId, items);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error performing bulk update:", error);
    return res.status(500).json({ error: "Failed to perform bulk update." });
  }
});

export default router;
