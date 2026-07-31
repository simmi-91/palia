import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export type AuthUser = {
    googleId: string;
    email: string;
    isAdmin: boolean;
  };
  
  export type AuthenticatedRequest = Request & {
    user?: AuthUser;
  };

  export function requireAuth(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    const token = req.headers.authorization?.split(" ")[1];
  
    if (!token) {
      return res.status(401).json({ error: "Access token missing." });
    }
  
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET!) as AuthUser;
      next();
    } catch {
      return res.status(401).json({ error: "Invalid or expired token." });
    }
  }
  
export function verifyAdmin(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    if (req.user && req.user.isAdmin) {
      return next();
    } else {
      return res
        .status(403)
        .json({ error: "You are not authorized to perform this operation" });
    }
  };
  