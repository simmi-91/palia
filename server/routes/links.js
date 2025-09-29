import { Router } from "express";
import db from "../db_links.js";

const router = Router();

router.get("/", async (req, res) => {
  const links = await db.getAllLinks();
  res.json(links);
});

export default router;
