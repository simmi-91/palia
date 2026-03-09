import { Router } from "express";
import { createDB } from "../db/db_entity.js";

const router = Router();

/**
 * @swagger
 * /entity/{entity}:
 *   get:
 *     summary: Get all entries for a given entity type
 *     tags: [Entity]
 *     parameters:
 *       - in: path
 *         name: entity
 *         required: true
 *         schema:
 *           type: string
 *           enum: [location, neededFor, howToObtain]
 *     responses:
 *       200:
 *         description: List of entity entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MultilistEntry'
 *   post:
 *     summary: Add a new entity entry
 *     tags: [Entity]
 *     parameters:
 *       - in: path
 *         name: entity
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MultilistEntry'
 *     responses:
 *       201:
 *         description: Entity created
 *   put:
 *     summary: Update an entity entry
 *     tags: [Entity]
 *     parameters:
 *       - in: path
 *         name: entity
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id]
 *             properties:
 *               id: { type: integer }
 *               title: { type: string }
 *               url: { type: string }
 *               category: { type: string }
 *     responses:
 *       200:
 *         description: Entity updated
 *   delete:
 *     summary: Delete an entity entry
 *     tags: [Entity]
 *     parameters:
 *       - in: path
 *         name: entity
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id]
 *             properties:
 *               id: { type: integer }
 *     responses:
 *       200:
 *         description: Entity deleted
 */

router.get("/:entity", async (req, res) => {
  const { entity } = req.params;

  let db;
  try {
    db = await createDB();
  } catch {
    console.error("Database connection failed for entity.");
    return res.status(503).json({ error: "Database service unavailable" });
  }

  const result = await db.getAllEntities(entity);
  res.json(result);
});

router.post("/:entity", async (req, res) => {
  const { entity } = req.params;
  const { newItem } = req.body;

  let db;
  try {
    db = await createDB();
  } catch {
    console.error("Database connection failed for entity.");
    return res.status(503).json({ error: "Database service unavailable" });
  }

  const result = await db.addEntitiy(entity, newItem);
  res.json(result);
});

router.put("/:entity", async (req, res) => {
  const { entity } = req.params;
  const { id, newItem } = req.body;

  let db;
  try {
    db = await createDB();
  } catch {
    console.error("Database connection failed for entity.");
    return res.status(503).json({ error: "Database service unavailable" });
  }

  try {
    const result = await db.updateEntitiy(entity, id, newItem);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error updating inventory:", error);
    return res.status(500).json({ error: "Failed to update inventory." });
  }
});

router.delete("/:entity", async (req, res) => {
  const { entity } = req.params;
  const { id } = req.body;

  let db;
  try {
    db = await createDB();
  } catch {
    console.error("Database connection failed for entity.");
    return res.status(503).json({ error: "Database service unavailable" });
  }

  try {
    const result = await db.deleteEntitiy(entity, id);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error updating inventory:", error);
    return res.status(500).json({ error: "Failed to update inventory." });
  }
});

export default router;
