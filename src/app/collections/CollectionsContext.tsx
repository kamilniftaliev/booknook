"use client";

import axios from "axios";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { toast } from "sonner";
import { Collection } from "@/types";
import _ from "lodash";

interface CollectionsContextType {
  collections: Collection[];
  isLoading: boolean;
  addCollection: (collection: Collection) => void;
  updateCollection: (collection: Collection) => void;
  deleteCollection: (collection: Collection) => void;
}

const CollectionsContext = createContext<CollectionsContextType | null>(null);

interface CollectionsProviderProps {
  children: ReactNode;
}

export function CollectionsProvider({ children }: CollectionsProviderProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) throw Error("Not authorized");

        setIsLoading(true);

        const { data, status, statusText } = await axios.get<Collection[]>(
          "/api/collections",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!data.length && status >= 300) {
          throw Error(statusText || "Something went wrong");
        }

        setCollections(data);
      } catch (err: any) {
        const e = err.response?.data || err;
        toast.error(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const addCollection = useCallback((collection: Collection) => {
    setCollections((collections) => [collection, ...collections]);
  }, []);

  const updateCollection = useCallback((collection: Collection) => {
    setCollections((collections) =>
      collections.map((col) => (col._id === collection._id ? collection : col))
    );
  }, []);

  const deleteCollection = useCallback(async (collection: Collection) => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) throw Error("Not authorized");

      setIsLoading(true);

      const { status, statusText } = await axios.delete(
        "/api/collections/" + collection._id,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (status >= 300) {
        throw Error(statusText || "Something went wrong");
      }

      setCollections((collections) => _.without(collections, collection));
    } catch (err: any) {
      const e = err.response?.data || err;
      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <CollectionsContext.Provider
      value={{
        collections,
        isLoading,
        deleteCollection,
        addCollection,
        updateCollection,
      }}
    >
      {children}
    </CollectionsContext.Provider>
  );
}

export const useCollections = (): CollectionsContextType => {
  const context = useContext(CollectionsContext);
  if (!context) {
    throw new Error(
      "useCollections must be used within an CollectionsProvider"
    );
  }
  return context;
};
