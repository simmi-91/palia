import { Router } from "express";
import { createDB } from "../db/db_entity.js";

const router = Router();

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
