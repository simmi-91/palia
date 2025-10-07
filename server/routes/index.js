import { Router } from "express";
import usersRouter from "./users.js";
import inventoryRouter from "./inventory.js";
import linksRouter from "./links.js";
import artifactsRouter from "./artifacts.js";
import plushRouter from "./plushies.js";

const apiRouter = Router();

// Mount individual routers under their respective paths
apiRouter.use("/users", usersRouter);
apiRouter.use("/inventory", inventoryRouter);

apiRouter.use("/links", linksRouter);
apiRouter.use("/artifacts", artifactsRouter);
apiRouter.use("/plushies", plushRouter);

export default apiRouter;
