import { Router } from "express";
import db from "../db_users.js";

const router = Router();

router.get("/", async (req, res) => {
  //await db.getAllUsers()
  //res.json(dbUsers.data);
});

router.post("/check", async (req, res) => {
  const { email, given_name, picture, id } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  const existingUser = await db.getUserByEmail(email);

  if (existingUser) {
    res.status(200).send({ message: "User logged in", user: existingUser });
  } else {
    const newProfile = { email, given_name, picture, id };
    await db.createUser(newProfile);
    res
      .status(201)
      .send({ message: "User created and logged in", user: newProfile });
  }
});

router.post("/register", async (req, res) => {
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

  const userToSave = {
    id,
    email,
    given_name,
    picture,
    registeredOn: new Date().toISOString(),
  };

  await db.createUser(userToSave);
  res.status(201).json({ success: true, user: userToSave });
});

export default router;
