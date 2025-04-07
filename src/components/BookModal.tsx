"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Book, GoogleBookData } from "@/types";
import axios from "axios";
import { GOOGLE_API_URL } from "@/constants";
import { parseGoogleBookData } from "@/utils";
import Image from "next/image";
import { BookInfoLine } from "./BookInfoLine";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";

interface Props {
  data?: Book;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

export function BookModal({ data, setModalOpen }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [fullBookInfo, setFullBookInfo] = useState<Book | null>(null);

  useEffect(() => {
    (async () => {
      try {
        if (!data) {
          return;
        }

        setIsLoading(true);
        const googleId = data.googleId || data.id;
        const { data: info, status } = await axios.get<GoogleBookData>(
          GOOGLE_API_URL + "/" + googleId
        );

        if (status >= 300 || !info) {
          toast.error("Something went wrong");
          return;
        }

        const parsedInfo = parseGoogleBookData(info);

        // @ts-expect-error - todo
        setFullBookInfo(parsedInfo);
      } catch (e: any) {
        toast.error(e.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [data]);

  return (
    <Dialog open onOpenChange={setModalOpen}>
      <DialogContent className="max-w-[90vw] sm:max-w-[60vw] lg:max-w-[60vw] max-h-[90vh] flex flex-col">
        {isLoading || !fullBookInfo ? (
          <DialogTitle className="py-20 text-center">
            <LoaderCircle className="mx-auto opacity-60 animate-spin" />
          </DialogTitle>
        ) : (
          <div>
            <DialogHeader>
              <DialogTitle className="text-center">
                {fullBookInfo?.title}
              </DialogTitle>
            </DialogHeader>
            <div className="flex gap-4 mt-3">
              <div className="flex flex-col gap-1.5 w-1/3 shrink-0">
                <Image
                  src={fullBookInfo?.imageUrl}
                  alt={fullBookInfo?.title}
                  width={200}
                  height={300}
                  className="w-full rounded-md border"
                />

                <BookInfoLine label="By:" value={fullBookInfo?.authors} />
                <BookInfoLine label="Pages:" value={fullBookInfo?.pageCount} />
                <BookInfoLine
                  label="Publisher:"
                  value={fullBookInfo?.publisher}
                />
                <BookInfoLine
                  label="Published on:"
                  value={fullBookInfo?.publishedDate}
                />
              </div>
              {fullBookInfo?.description && (
                <div>
                  <DialogDescription
                    dangerouslySetInnerHTML={{
                      __html: fullBookInfo?.description || "",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
