import { Types } from "mongoose";

export type BookInputData = {
  authors: string;
  title: string;
  imageUrl: string;
  googleId: string;
};

export type Book = BookInputData & {
  id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  pageCount?: number;
  publisher?: string;
  publishedDate?: string;
  description?: string;
  isTrending?: boolean;
};

export type GoogleBookData = {
  id: string;
  volumeInfo: {
    title: string;
    subtitle: string;
    authors: string[];
    pageCount: number;
    publisher: string;
    publishedDate: string;
    description: string;
    imageLinks: {
      smallThumbnail: string;
      thumbnail?: string;
      small?: string;
      medium?: string;
      large?: string;
      extraLarge?: string;
    };
  };
};
