import { useCallback, useState, ChangeEvent } from "react";
import { Book } from "@/types";
import axios from "axios";
import { toast } from "sonner";

let searchTimeout: NodeJS.Timeout;

export function useSearchBooks() {
  const [{ books, isLoading, query, totalBooksCount, page }, setBooks] =
    useState<{
      books: Book[];
      isLoading: boolean;
      query: string;
      totalBooksCount: number;
      page: number;
    }>({
      query: "",
      books: [],
      isLoading: false,
      totalBooksCount: 0,
      page: 0,
    });

  const resetState = useCallback(() => {
    setBooks((state) => ({
      ...state,
      query: "",
      books: [],
      isLoading: false,
      totalBooksCount: 0,
      page: 0,
    }));
  }, []);

  const search = useCallback(
    async (query: string, page: number) => {
      setBooks((state) => ({
        ...state,
        isLoading: true,
      }));

      try {
        const { data, status, statusText } = await axios.get<{
          books: Book[];
          totalItems: number;
        }>("/api/books", {
          params: { query, page },
        });

        if (status === 500) throw Error(statusText || "Something went wrong");

        setBooks((state) => ({
          ...state,
          books: [...state.books, ...data.books],
          totalBooksCount: data.totalItems,
          isLoading: false,
        }));
      } catch (error) {
        // @ts-expect-error - TODO
        toast.error(error.message);

        resetState();
      }
    },
    [resetState]
  );

  const onChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const newQuery = value.replaceAll(/\s+/g, " ");

    // Don't search if for example whitespace was added
    const isDifferent = query.trim() !== newQuery.trim();

    setBooks((state) => ({
      ...state,
      query: newQuery,
    }));

    if (!isDifferent) return;

    if (!newQuery.length) {
      resetState();
      return;
    }

    setBooks((state) => ({
      ...state,
      books: [],
      page: 0,
    }));

    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => search(newQuery, 0), 500);
  };

  const loadMore = () => {
    setBooks((state) => ({
      ...state,
      page: state.page + 1,
    }));

    search(query, page + 1);
  };

  const shouldShowList = books.length > 0 || isLoading;

  return {
    onChange,
    shouldShowList,
    books,
    isLoading,
    resetState,
    loadMore,
    query,
    totalBooksCount,
  };
}
