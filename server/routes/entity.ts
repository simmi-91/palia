import { Router } from "express";
import type { Request, Response } from "express";
import { createDB } from "../db/db_entity.js";
import type { EntityType } from "../types/models.js";
import type { EntityParam, CreateEntityBody, UpdateEntityBody, DeleteEntityBody } from "../types/requests.js";

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
 *                 $ref: '#/components/schemas/EntityLink'
 *       503:
 *         description: Database service unavailable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *             type: object
 *             required: [newItem]
 *             properties:
 *               newItem:
 *                 $ref: '#/components/schemas/EntityLink'
 *     responses:
 *       200:
 *         description: Entity added
 *       503:
 *         description: Database service unavailable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *               newItem:
 *                 $ref: '#/components/schemas/EntityLink'
 *     responses:
 *       200:
 *         description: Entity updated
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

router.get("/:entity", async (req: Request<EntityParam>, res: Response) => {
  const entity = req.params.entity as EntityType;

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

router.post("/:entity", async (req: Request<EntityParam, unknown, CreateEntityBody>, res: Response) => {
  const entity = req.params.entity as EntityType;
  const { newItem } = req.body;

  let db;
  try {
    db = await createDB();
  } catch {
    console.error("Database connection failed for entity.");
    return res.status(503).json({ error: "Database service unavailable" });
  }

  const result = await db.addEntity(entity, newItem);
  res.json(result);
});

router.put("/:entity", async (req: Request<EntityParam, unknown, UpdateEntityBody>, res: Response) => {
  const entity = req.params.entity as EntityType;
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

router.delete("/:entity", async (req: Request<EntityParam, unknown, DeleteEntityBody>, res: Response) => {
  const entity = req.params.entity as EntityType;
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
