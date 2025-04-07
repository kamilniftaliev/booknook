import { Collection } from "@/types";
import mongoose, { Document, Schema, Types } from "mongoose";

export interface ICollection extends Document, Omit<Collection, "id" | "_id"> {}

const collectionSchema = new Schema<ICollection>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    books: [
      {
        type: Types.ObjectId,
        ref: "Book",
      },
    ],
    user: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const CollectionModel =
  mongoose.models?.Collection ||
  mongoose.model<ICollection>("collection", collectionSchema);
