import { Router } from "express";
import { createDB } from "../db_wiki/db_artifacts.js";

const router = Router();

router.get("/", async (req, res) => {
  let db;
  try {
    db = await createDB();
  } catch {
    console.error("Database connection failed for artifacts.");
    return res.status(503).json({ error: "Database service unavailable" });
  }

  const artifacts = await db.getAll();
  res.json(artifacts);
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

export default router;
