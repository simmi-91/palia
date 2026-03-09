import { Router } from "express";
import { createDB } from "../db/db_items.js";

const router = Router();

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Get all items
 *     tags: [Items]
 *     responses:
 *       200:
 *         description: List of all items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 *       503:
 *         description: Database unavailable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Add a new item
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       201:
 *         description: Item created
 *       503:
 *         description: Database unavailable
 *
 * /items/{id}:
 *   put:
 *     summary: Update an item
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       200:
 *         description: Item updated
 *       404:
 *         description: Item not found
 *   delete:
 *     summary: Delete an item
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item deleted
 *       404:
 *         description: Item not found
 */

router.get("/", async (req, res) => {
    let db;
    try {
        db = await createDB();
    } catch {
        console.error("Database connection failed for items.");
        return res.status(503).json({ error: "Database service unavailable" });
    }

    const items = await db.getAll();
    res.json(items);
});

router.post("/", async (req, res) => {
    let db;
    try {
        db = await createDB();
    } catch {
        console.error("Database connection failed.");
        return res.status(503).json({ error: "Database service unavailable" });
    }

    try {
        const result = await db.addItem(req.body);
        if (!result.success) return res.status(500).json({ error: result.error });
        return res.status(201).json(result);
    } catch (error) {
        console.error("Error adding item:", error);
        return res.status(500).json({ error: "Failed to add item." });
    }
});

router.put("/:id", async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    let db;
    try {
        db = await createDB();
    } catch {
        console.error("Database connection failed.");
        return res.status(503).json({ error: "Database service unavailable" });
    }

    try {
        const result = await db.updateItem(id, req.body);
        if (!result.success) return res.status(404).json({ error: result.error ?? "Not found" });
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error updating item:", error);
        return res.status(500).json({ error: "Failed to update item." });
    }
});

router.delete("/:id", async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    let db;
    try {
        db = await createDB();
    } catch {
        return res.status(503).json({ error: "Database service unavailable" });
    }

    try {
        const result = await db.deleteItem(id);
        if (!result.success) return res.status(404).json({ error: result.error ?? "Not found" });
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error deleting item:", error);
        return res.status(500).json({ error: "Failed to delete item." });
    }
});

export default router;
