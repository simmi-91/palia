import { Router } from "express";
import jwt, { type SignOptions } from "jsonwebtoken";
import { verifyGoogleToken } from "../service/googleAuth.js";
import { createDB } from "../db/db_users.js";

const router = Router();

router.post("/login", async (req, res) => {

  const JWT_SECRET = process.env.JWT_SECRET;
  const JWT_EXPIRY = (process.env.JWT_EXPIRY ?? "30d") as SignOptions["expiresIn"];
  
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
  }
  
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Google ID token is required." });
  }

  const payload = await verifyGoogleToken(token);

  if (!payload?.sub || !payload.email) {
    return res.status(401).json({ error: "Invalid or expired Google token." });
  }

  const db = await createDB();
  let user = await db.getUserByEmail(payload.email);

  if (!user) {
    await db.createUser({
      id: payload.sub,
      email: payload.email,
      givenName: payload.given_name ?? payload.name ?? payload.email,
      picture: payload.picture,
    });

    user = await db.getUserByEmail(payload.email);
  }

  if (!user) {
    return res.status(500).json({ error: "Could not create user." });
  }

  const appToken = jwt.sign(
    {
      googleId: user.google_id,
      email: user.email,
      isAdmin: Boolean(user.admin),
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
  
  const decoded = jwt.decode(appToken) as { exp?: number };

  res.json({
    token: appToken,
    expiresAt: decoded.exp ? decoded.exp * 1000 : null,
    profile: {
      id: user.google_id,
      email: user.email,
      givenName: user.givenName,
      picture: user.picture,
      isAdmin: Boolean(user.admin),
    },
  });
});

export default router;