import { Router } from "express";
import { createDB } from "../db/db_categories.js";

const router = Router();

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
