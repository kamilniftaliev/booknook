"use client";

import { useAuth } from "@/components";
import { X, LoaderCircle } from "lucide-react";
import { CollectionModal } from "./CollectionModal";
import { useCollections } from "./CollectionsContext";
import { cn, getRandomColor } from "@/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Collection } from "@/types";

export default function Collections() {
  const { isLoading: isLoadingAuth } = useAuth();
  const {
    collections,
    isLoading: isLoadingCollections,
    deleteCollection,
  } = useCollections();
  const [selectedCollection, setSelectedCollection] = useState<
    Collection | undefined
  >();

  const isLoading = isLoadingAuth || isLoadingCollections;

  return (
    <div
      className={cn("flex flex-col items-center", {
        "py-[15vh]": collections.length === 0,
      })}
    >
      {isLoading ? (
        <LoaderCircle className="mx-auto opacity-60 animate-spin" />
      ) : (
        <>
          <div className="flex flex-wrap gap-5 justify-center">
            {collections.length ? (
              collections.map((collection) => {
                const { _id, title, books } = collection;
                const color = getRandomColor();

                return (
                  <div
                    key={_id}
                    onClick={() => {
                      setSelectedCollection(collection);
                    }}
                    className={cn(
                      "relative w-[40vw] sm:w-[30vw] lg:w-[15vw] xl:w-[10vw] group p-3 cursor-pointer hover:scale-[102%] hover:shadow-md transition-all",
                      color.bg
                    )}
                  >
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCollection(collection);
                      }}
                      className="absolute -top-2 -right-2 p-1! opacity-0 group-hover:opacity-100 h-auto rounded-full cursor-pointer"
                    >
                      <X />
                    </Button>
                    <div
                      className={cn("w-full aspect-[2/3]")}
                      style={{ backgroundImage: `url(${books[0].imageUrl})` }}
                    />
                    <h4 className={cn("mt-2", color.title)}>{title}</h4>
                  </div>
                );
              })
            ) : (
              <p className="text-center">You don`t have any book collections</p>
            )}
          </div>

          <CollectionModal data={selectedCollection} />
        </>
      )}
    </div>
  );
}
