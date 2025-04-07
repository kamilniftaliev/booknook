import { Book, User } from "@/types";
import { BookModel, CollectionModel, ICollection } from "../models";
import { createBook } from "./book.service";

export async function getTrendingCollections(): Promise<ICollection[]> {
  return await CollectionModel.find();
}

export async function getAllCollections(user: User["id"]) {
  return CollectionModel.find({
    user,
  }).populate("books");
}

export async function getCollectionById(id: string) {
  return await CollectionModel.findById(id);
}

export async function createCollection(data: ICollection, userId: string) {
  const books: Book[] = [];

  for await (const { title, authors, imageUrl, googleId } of data.books || []) {
    const newBook = await createBook({ title, authors, imageUrl, googleId });
    books.push(newBook);
  }

  const newCollection = await CollectionModel.create({
    title: data.title,
    isPublic: data.isPublic,
    books: books.map((book) => book.id),
    user: userId,
  });

  return await newCollection.populate("books");
}

export async function updateCollection(id: string, data: Partial<ICollection>) {
  // @ts-expect-error - todo
  const books: Book[] = data.books?.filter((book) => book._id) || [];

  // @ts-expect-error - todo
  const newBooks = data.books?.filter((book) => !book._id);

  for await (const { title, authors, imageUrl, googleId } of newBooks || []) {
    const newBook = await createBook({ title, authors, imageUrl, googleId });
    books.push(newBook);
  }

  const result = await CollectionModel.findByIdAndUpdate(
    id,
    {
      ...data,
      // @ts-expect-error - todo
      books: books.map((b) => b._id),
    },
    {
      new: true,
    }
  );

  return result.populate("books");
}

export async function deleteCollection(id: string) {
  const collection = await getCollectionById(id);

  if (!collection) throw Error("Collection not found");

  await BookModel.deleteMany({
    _id: {
      $in: collection.books,
    },
  });

  return await CollectionModel.findByIdAndDelete(id);
}
