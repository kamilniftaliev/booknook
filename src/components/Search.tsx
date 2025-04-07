"use client";

import { X, CirclePlus, CircleCheck, LoaderCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { cn } from "@/utils";
import { BookInfoLine } from "./BookInfoLine";
import { BOOK_SEARCH_INPUT_PLACEHOLDER } from "@/constants";
import { useSearchBooks } from "@/hooks";
import { Book } from "@/types";
import { Button } from "@/components/ui/button";
import InfiniteScroll from "react-infinite-scroll-component";
import { MouseEventHandler, useState } from "react";
import { BookModal } from "./BookModal";

interface Props {
  containerClasses?: string;
  listContainerClass?: string;
  bookContainerClass?: string;
  inputClass?: string;
  onRemove?: (book: Book) => void;
  onAdd?: (book: Book) => void;
  selectedBooks?: Book[];
}

export function Search({
  containerClasses,
  listContainerClass,
  bookContainerClass,
  inputClass,
  onRemove,
  onAdd,
  selectedBooks = [],
}: Props) {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const {
    query,
    books,
    totalBooksCount,
    onChange,
    resetState,
    loadMore,
    shouldShowList,
    isLoading,
  } = useSearchBooks();

  const hasMore = books.length < totalBooksCount;

  return (
    <div className={cn("relative gap-6 px-4 mx-auto w-full", containerClasses)}>
      <div className="flex gap-4 items-center bg-white rounded-md">
        <Input
          placeholder={BOOK_SEARCH_INPUT_PLACEHOLDER}
          className={cn(
            "p-2 sm:p-4",
            {
              "pr-7": query.length > 0,
            },
            inputClass
          )}
          onChange={onChange}
          value={query}
        />
        {query.length > 0 && (
          <X
            className="-ml-10 opacity-80 cursor-pointer sm:-ml-11"
            onClick={resetState}
            size={17}
          />
        )}
      </div>

      {selectedBook && (
        <BookModal
          data={selectedBook}
          setModalOpen={() => setSelectedBook(null)}
        />
      )}

      {shouldShowList && (
        <div
          className={cn(
            "flex overflow-auto z-10 flex-col mt-2 bg-white rounded-md scrollbar max-h-[43vh]",
            listContainerClass
          )}
          id="search-container"
        >
          <InfiniteScroll
            dataLength={books.length}
            next={loadMore}
            hasMore={hasMore}
            scrollableTarget="search-container"
            loader={
              <div className="py-5 w-full">
                <LoaderCircle className="mx-auto opacity-60 animate-spin" />
              </div>
            }
            endMessage={
              isLoading ? null : (
                <div className="py-5 w-full text-center">
                  <p>You`ve reached the end!</p>
                </div>
              )
            }
          >
            {books.map((book) => {
              const {
                id,
                title,
                authors,
                imageUrl,
                pageCount,
                publisher,
                publishedDate,
              } = book;

              const alreadyAdded = selectedBooks.includes(book);

              const onClick: MouseEventHandler<HTMLButtonElement> = (e) => {
                e.stopPropagation();

                if (alreadyAdded) {
                  onRemove?.(book);
                } else {
                  onAdd?.(book);
                }
              };

              return (
                <div
                  key={id}
                  className={cn(
                    "flex gap-2 px-3 py-2 rounded-lg cursor-pointer shrink",
                    bookContainerClass
                  )}
                  onClick={() => setSelectedBook(book)}
                >
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt={title}
                      width={60}
                      height={80}
                      className="object-cover rounded border border-gray-200 shadow-md"
                    />
                  )}
                  <div className="truncate shrink">
                    <h3 className="text-lg font-semibold truncate">{title}</h3>
                    <p className="text-gray-600">{authors}</p>
                    <BookInfoLine label="Pages:" value={pageCount} />
                    <BookInfoLine label="Publisher:" value={publisher} />
                    <BookInfoLine label="Published on:" value={publishedDate} />
                  </div>
                  <div className="flex flex-col gap-3 justify-center ml-auto">
                    {!!onAdd && !!onRemove && (
                      <Button className="cursor-pointer" onClick={onClick}>
                        {alreadyAdded ? <CircleCheck /> : <CirclePlus />}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </InfiniteScroll>
        </div>
      )}
    </div>
  );
}
