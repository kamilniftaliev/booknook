// Use module augmentation instead of namespace
declare module "express" {
  interface Request {
    user?: { userId: string };
  }
}

import { Request, Response } from "express";
import { CollectionService } from "../services";

export async function getCollections(req: Request, res: Response) {
  try {
    if (!req.user?.userId) throw new Error("Not aurhorized");

    const collections = await CollectionService.getAllCollections(
      req.user.userId
    );

    res.json(collections);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Server Error" });
  }
}

export async function getCollection(req: Request, res: Response) {
  try {
    const collection = await CollectionService.getCollectionById(req.params.id);
    if (!collection) res.status(404).json({ message: "Collection not found" });
    res.json(collection);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
}

export async function createCollection(req: Request, res: Response) {
  try {
    if (!req.user?.userId) {
      throw Error("Not authorized");
    }

    const newCollection = await CollectionService.createCollection(
      req.body,
      req.user?.userId
    );

    res.status(201).json({
      collection: newCollection,
      message: "Created successfully",
    });
  } catch (error) {
    console.log("error", error);
    res.status(400).json({ message: "Something went wrong" });
  }
}

export async function updateCollection(req: Request, res: Response) {
  try {
    const updatedCollection = await CollectionService.updateCollection(
      req.params.id,
      req.body
    );

    res.json({
      collection: updatedCollection,
      message: "Updated successfully",
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Server Error" });
  }
}

export async function deleteCollection(req: Request, res: Response) {
  try {
    const deletedCollection = await CollectionService.deleteCollection(
      req.params.id
    );
    if (!deletedCollection)
      res.status(404).json({ message: "Collection not found" });

    res.json({ message: "Collection deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
}
