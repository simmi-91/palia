import { Router } from "express";

import usersRouter from "./users.js";
import linksRouter from "./links.js";
import inventoryRouter from "./inventory.js";
import favoritesRouter from "./favorites.js";
import itemsRouter from "./items.js";
import categoryRouter from "./categories.js";
import entityRouter from "./entity.js";

const apiRouter = Router();

// main routes
apiRouter.use("/users", usersRouter);
apiRouter.use("/links", linksRouter);

apiRouter.use("/inventory", inventoryRouter);
apiRouter.use("/favorites", favoritesRouter);

apiRouter.use("/items", itemsRouter);
apiRouter.use("/categories", categoryRouter);

apiRouter.use("/entity", entityRouter);

export default apiRouter;
