import { Router } from "express";
import { dbFruits } from "../db/index.js";

const router = Router();

// Handles GET requests to /api/fruits
router.get("/", (req, res) => {
  res.json(dbFruits.data);
});

export default router;
