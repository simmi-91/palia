import { Router } from "express";

import usersRouter from "./users.js";
import inventoryRouter from "./inventory.js";
import linksRouter from "./links.js";

import artifactsRouter from "./artifacts.js";
import bugsRouter from "./bugs.js";
import fishRouter from "./fish.js";
import plushRouter from "./plushies.js";
import potato_podsRouter from "./potato_pods.js";
import stickersRouter from "./stickers.js";

const apiRouter = Router();

// main routes
apiRouter.use("/users", usersRouter);
apiRouter.use("/inventory", inventoryRouter);
apiRouter.use("/links", linksRouter);

// wiki routes
apiRouter.use("/artifacts", artifactsRouter);
apiRouter.use("/bugs", bugsRouter);
apiRouter.use("/fish", fishRouter);
apiRouter.use("/plushies", plushRouter);
apiRouter.use("/potato_pods", potato_podsRouter);
apiRouter.use("/stickers", stickersRouter);

export default apiRouter;
