import { Request, Response } from "express";
import { BookService } from "../services";
import axios from "axios";
import { IBook } from "@/models";
import { parseGoogleBookData } from "../utils";
import { GoogleBookData } from "@/types";
import { GOOGLE_API_URL } from "../constants";

export async function getBooks(
  req: Request<{
    query: string;
  }>,
  res: Response
): Promise<void> {
  try {
    let books: IBook[] = [];
    let totalItems = 0;

    const query = (req.query.query as string)?.trim();
    const page = Number(req.query.page) || 0;

    if (query) {
      const response = await axios.get(GOOGLE_API_URL, {
        params: {
          q: query,
          maxResults: 20,
          startIndex: page * 20,
        },
      });

      const { data } = response;

      totalItems = data.totalItems;

      books =
        totalItems > 0
          ? data.items
              .filter(Boolean)
              .map((data: GoogleBookData) => parseGoogleBookData(data))
          : [];
    } else {
      books = await BookService.getAllBooks();
      totalItems = books.length;
    }

    res.json({
      books,
      totalItems,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Server Error" });
  }
}

export async function getTrendingBooks(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const books = await BookService.getTrendingBooks();
    const totalItems = books.length;

    res.json({
      books,
      totalItems,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Server Error" });
  }
}

export async function getBook(req: Request, res: Response): Promise<void> {
  try {
    const book = await BookService.getBookById(req.params.id);
    if (!book) res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
}

export async function createBook(req: Request, res: Response): Promise<void> {
  try {
    const newBook = await BookService.createBook(req.body);
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ message: "Invalid book data" });
  }
}

export async function deleteBook(req: Request, res: Response): Promise<void> {
  try {
    const deletedBook = await BookService.deleteBook(req.params.id);
    if (!deletedBook) res.status(404).json({ message: "Book not found" });

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
}
