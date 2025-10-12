import { Router } from "express";
import { createDB } from "../db/db_inventory.js";

const router = Router();

const collectionMap = {
  artifacts: "user_artifacts",
  plushies: "user_plushies",
  bugs: "user_bugs",
};

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
