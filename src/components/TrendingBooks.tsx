"use client";

import { getRandomColor } from "@/utils";
import { useEffect, useState } from "react";
import { Book } from "@/types";
import axios from "axios";
import { BookModal } from "./BookModal";

export function TrendingBooks() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    (async () => {
      const { data, status } = await axios.get<{
        books: Book[];
        totalItems: number;
      }>("/api/books/trending");

      if (!data || status >= 300) return;

      setBooks(data.books);
    })();
  }, []);

  return (
    <div className="flex flex-col gap-6 -mt-72">
      <h2 className="text-4xl font-bold text-center text-white">
        Trending Books
      </h2>
      {selectedBook && (
        <BookModal
          data={selectedBook}
          setModalOpen={() => setSelectedBook(null)}
        />
      )}
      <div className="flex flex-wrap gap-5 justify-center items-start sm:gap-10 lg:gap-20">
        {books.map((book) => {
          const { _id, title, authors, imageUrl } = book;
          const color = getRandomColor();

          return (
            <div
              key={_id}
              className={`flex cursor-pointer hover:scale-[102%] hover:shadow-xl transition-all flex-col min-w-36 max-w-2xs w-[20vw] grow-0 shrink-0 items-center gap-3 py-3 px-3 lg:px-4 lg:py-4 ${color.bg} rounded-2xl`}
              onClick={() => setSelectedBook(book)}
            >
              <span
                className="w-full rounded-2xl aspect-[2/3] bg-cover bg-center shadow-[0_5px_15px_rgba(0,0,0,0.20)]"
                style={{ backgroundImage: `url(${imageUrl})` }}
              />
              <div className="flex flex-col w-full">
                <h3
                  className={`text-lg lg:text-2xl truncate font-medium text-center ${color.title}`}
                >
                  {title}
                </h3>
                {authors && (
                  <h4
                    className={`text-sm lg:text-md text-center ${color.author}`}
                  >
                    {authors}
                  </h4>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
