import { Router } from "express";
import { createDB } from "../db/db_links.js";

const router = Router();

/**
 * @swagger
 * /links:
 *   get:
 *     summary: Get all external links
 *     tags: [Links]
 *     responses:
 *       200:
 *         description: List of links
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id: { type: integer }
 *                   site: { type: string }
 *                   url: { type: string }
 *                   logo: { type: string, nullable: true }
 *                   description: { type: string, nullable: true }
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
    console.error("Database connection failed for links.");
    return res.status(503).json({ error: "Database service unavailable" });
  }

  const links = await db.getAllLinks();
  res.json(links);
});

export default router;
