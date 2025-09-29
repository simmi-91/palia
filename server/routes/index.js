import { Router } from "express";
import linksRouter from "./links.js";
import usersRouter from "./users.js";

const apiRouter = Router();

// Mount individual routers under their respective paths
apiRouter.use("/links", linksRouter); // Matches /api/links...
apiRouter.use("/users", usersRouter); // Matches /api/users...

export default apiRouter;
