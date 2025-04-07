import { Router } from "express";
import { BookController } from "../controllers";

export const bookRouter = Router();

bookRouter.get("/trending", BookController.getTrendingBooks);
bookRouter.get("/:query?", BookController.getBooks);
bookRouter.post("/", BookController.createBook);
bookRouter.delete("/:id", BookController.deleteBook);
