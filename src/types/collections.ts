import { Types } from "mongoose";
import { Book } from "./books";
import { User } from "./users";

export type Collection = {
  _id: string;
  id: Types.ObjectId;
  title: string;
  books: Book[];
  user: User;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export interface ICollectionResponse {
  message: string;
  collection: Collection;
}
