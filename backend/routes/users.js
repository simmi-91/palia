import { Router } from "express";
import { dbUsers } from "../db/index.js";

const router = Router();

// Handles GET requests to /api/users
router.get("/", (req, res) => {
  res.json(dbUsers.data);
});

export default router;
