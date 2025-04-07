import { Router } from "express";
import { CollectionController } from "../controllers";
import { authenticate } from "../middleware";

export const collectionRouter = Router();

collectionRouter.get("/", authenticate, CollectionController.getCollections);
collectionRouter.get("/:id", authenticate, CollectionController.getCollection);
collectionRouter.post("/", authenticate, CollectionController.createCollection);
collectionRouter.put(
  "/:id",
  authenticate,
  CollectionController.updateCollection
);
collectionRouter.delete(
  "/:id",
  authenticate,
  CollectionController.deleteCollection
);
