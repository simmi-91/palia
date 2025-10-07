import { Router } from "express";
import usersRouter from "./users.js";
import collectionRouter from "./collection.js";
import linksRouter from "./links.js";
import artifactsRouter from "./artifacts.js";
import plushRouter from "./plushies.js";

const apiRouter = Router();

// Mount individual routers under their respective paths
apiRouter.use("/users", usersRouter);
apiRouter.use("/collection", collectionRouter);

apiRouter.use("/links", linksRouter);
apiRouter.use("/artifacts", artifactsRouter);
apiRouter.use("/plushies", plushRouter);

export default apiRouter;
