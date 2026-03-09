import { Router } from "express";
import { createDB } from "../db/db_categories.js";

const router = Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of all categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
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
 * /categories/{id}:
 *   post:
 *     summary: Add a new category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newCategory: { type: object }
 *     responses:
 *       201:
 *         description: Category created
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
 *   put:
 *     summary: Replace a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newCategory: { type: object }
 *     responses:
 *       200:
 *         description: Category updated
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
 *   patch:
 *     summary: Partially update a category (e.g. toggle flags)
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               display_name: { type: string }
 *               is_visible: { type: boolean }
 *               is_tradeable: { type: boolean }
 *               is_favoritable: { type: boolean }
 *     responses:
 *       200:
 *         description: Category patched
 *       400:
 *         description: Bad request – missing or invalid fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Not found – resource with given ID does not exist
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
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted
 *       404:
 *         description: Not found – resource with given ID does not exist
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

router.get("/", async (req, res) => {
    let db;
    try {
        db = await createDB();
    } catch {
        console.error("Database connection failed for category.");
        return res.status(503).json({ error: "Database service unavailable" });
    }

    try {
        const categories = await db.getAllCategories();
        return res.json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        return res.status(500).json({ error: "Failed to fetch categories." });
    }
});

router.post("/:id", async (req, res) => {
    const { id } = req.params;
    const { newCategory } = req.body;

    let db;
    try {
        db = await createDB();
    } catch {
        console.error("Database connection failed for category.");
        return res.status(503).json({ error: "Database service unavailable" });
    }

    try {
        await db.addCategory(id, newCategory);
        return res.status(201).json({ success: true });
    } catch (error) {
        console.error("Error adding category:", error);
        return res.status(500).json({ error: "Failed to add category." });
    }
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { newCategory } = req.body;

    let db;
    try {
        db = await createDB();
    } catch {
        console.error("Database connection failed for category.");
        return res.status(503).json({ error: "Database service unavailable" });
    }

    try {
        await db.updateCategory(id, newCategory);
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error updating category:", error);
        return res.status(500).json({ error: "Failed to update category." });
    }
});

router.patch("/:id", async (req, res) => {
    const { id } = req.params;

    let db;
    try {
        db = await createDB();
    } catch {
        console.error("Database connection failed for category.");
        return res.status(503).json({ error: "Database service unavailable" });
    }

    try {
        const result = await db.patchCategory(id, req.body);
        if (!result.success) return res.status(404).json({ error: result.error });
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error updating category:", error);
        return res.status(500).json({ error: "Failed to update category." });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    let db;
    try {
        db = await createDB();
    } catch {
        console.error("Database connection failed for category.");
        return res.status(503).json({ error: "Database service unavailable" });
    }

    try {
        await db.deleteCategory(id);
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error deleting category:", error);
        return res.status(500).json({ error: "Failed to delete category." });
    }
});

export default router;
