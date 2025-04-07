import { GoogleBookData } from "../types";
import moment from "moment";

export function parseGoogleBookData(data: GoogleBookData) {
  const {
    id,
    volumeInfo: {
      title,
      // subtitle,
      authors: originalAuthors = "",
      publisher = "",
      publishedDate: originalPublishedDate,
      pageCount,
      imageLinks = {} as GoogleBookData["volumeInfo"]["imageLinks"],
      description = "",
    },
  } = data;

  if (!imageLinks) {
    console.log("data", data);
  }

  const imageUrl =
    imageLinks.extraLarge ||
    imageLinks.large ||
    imageLinks.medium ||
    imageLinks.small ||
    imageLinks.thumbnail ||
    imageLinks.smallThumbnail;

  const authors = Array.isArray(originalAuthors)
    ? originalAuthors.join(", ")
    : originalAuthors;

  const publishedDate = moment(originalPublishedDate).isValid()
    ? moment(originalPublishedDate).format("MMMM Do YYYY")
    : "";

  return {
    id,
    googleId: id,
    title,
    authors,
    imageUrl,
    publisher,
    publishedDate,
    pageCount,
    description,
  };
}
