import { Router } from "express";
import { dbLinks } from "../db/index.js";

const router = Router();

router.get("/", (req, res) => {
  res.json(dbLinks.data);
});

export default router;
