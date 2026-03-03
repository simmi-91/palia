import { Router } from "express";
import { createDB } from "../db_wiki/db_bugs.js";

const router = Router();

router.get("/", async (req, res) => {
  let db;
  try {
    db = await createDB();
  } catch {
    console.error("Database connection failed for bugs.");
    return res.status(503).json({ error: "Database service unavailable" });
  }

  const bugs = await db.getAll();
  res.json(bugs);
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
