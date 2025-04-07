import { BookInputData, Book } from "@/types";
import { BookModel, IBook } from "../models/book.model";

export async function getTrendingBooks(): Promise<IBook[]> {
  return await BookModel.find({
    isTrending: true,
  });
}

export async function getAllBooks(): Promise<IBook[]> {
  return await BookModel.find();
}

export async function getBookById(id: string): Promise<IBook | null> {
  return await BookModel.findById(id);
}

export async function createBook(data: BookInputData): Promise<Book> {
  const previousBook = await BookModel.findOne({
    googleId: data.googleId,
  });

  if (previousBook) return previousBook;

  return await BookModel.create(data);
}

export async function deleteBook(id: string): Promise<IBook | null> {
  return await BookModel.findByIdAndDelete(id);
}
