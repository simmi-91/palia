import { Router } from "express";
import { createDB } from "../db/db_users.js"; // Import createDB

const router = Router();

router.get("/", async (req, res) => {
  res.send("Users API.");
});

router.post("/check", async (req, res) => {
  let db;
  try {
    db = await createDB();
  } catch {
    console.error("Database connection failed for users.");
    return res.status(503).json({ error: "Database service unavailable" });
  }

  const { email } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  const existingUser = await db.getUserByEmail(email);
  if (existingUser) {
    res.status(200).send({
      message: "User logged in",
      exists: true,
      isAdmin: existingUser.admin,
    });
  } else {
    res.status(200).send({ message: "User not exist", exists: false });
  }
});

router.post("/register", async (req, res) => {
  let db;
  try {
    db = await createDB();
  } catch {
    console.error("Database connection failed for users.");
    return res.status(503).json({ error: "Database service unavailable" });
  }

  const { id, email, given_name, picture } = req.body;
  if (!id || !email || !given_name) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required user fields" });
  }

  const exists = await db.getUserByEmail(email);
  if (exists) {
    return res
      .status(409)
      .json({ success: false, message: "User already registered" });
  }

  const newProfile = { email, given_name, picture, id };
  await db.createUser(newProfile);
  res
    .status(201)
    .json({ success: true, user: { ...newProfile, isAdmin: false } });
});

export default router;
