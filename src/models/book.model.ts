import { Book } from "@/types";
import mongoose, { Document, Schema } from "mongoose";

export interface IBook extends Document, Omit<Book, "id" | "_id"> {}

const bookSchema = new Schema<IBook>(
  {
    authors: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
    },
    googleId: {
      type: String,
    },
    isTrending: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

export const BookModel =
  mongoose.models?.Book || mongoose.model<IBook>("Book", bookSchema);
