import { Router } from "express";
import fruitsRouter from "./fruits.js";
import usersRouter from "./users.js";

const apiRouter = Router();

// Mount individual routers under their respective paths
apiRouter.use("/fruits", fruitsRouter); // Matches /api/fruits...
apiRouter.use("/users", usersRouter); // Matches /api/users...

export default apiRouter;
