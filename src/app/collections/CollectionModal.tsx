"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { collectionFormSchema } from "@/constants";
import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Book, Collection, ICollectionResponse } from "@/types";
import { Search, Books } from "@/components";
import { toast } from "sonner";
import axios from "axios";
import _ from "lodash";
import { useCollections } from "./CollectionsContext";

interface Props {
  data?: Collection;
}

export function CollectionModal({ data }: Props) {
  const [selectedBooks, setSelectedBooks] = useState<Book[]>(data?.books || []);
  const [isLoading, setIsLoading] = useState(false);
  const { addCollection, updateCollection } = useCollections();
  const [isModalOpen, setModalOpen] = useState(false);

  const form = useForm<z.infer<typeof collectionFormSchema>>({
    resolver: zodResolver(collectionFormSchema),
    defaultValues: {
      title: data?.title || "",
      isPublic: data?.isPublic || true,
    },
  });

  useEffect(() => {
    if (data) {
      form.setValue("title", data.title);
      form.setValue("isPublic", data.isPublic);
      setSelectedBooks(data.books);
      setModalOpen(true);
    }
  }, [data, form]);

  const onSubmit = async (inputData: z.infer<typeof collectionFormSchema>) => {
    try {
      if (!selectedBooks.length) {
        throw Error("You must add books to your collection");
      }

      const token = localStorage.getItem("authToken");

      if (!token) throw Error("Not authorized");

      setIsLoading(true);

      const method = data ? "put" : "post";

      const { data: response, statusText } = await axios[
        method
      ]<ICollectionResponse>(
        "/api/collections" + (data ? `/${data?._id}` : ""),
        {
          books: selectedBooks,
          title: inputData.title,
          isPublic: inputData.isPublic,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(response.message || statusText);
      setModalOpen(false);

      if (data) {
        updateCollection(response.collection);
      } else {
        addCollection(response.collection);
      }

      setSelectedBooks([]);
      form.resetField("title");
    } catch (err: any) {
      const e = err.response?.data || err;
      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addBook = (book: Book) => {
    setSelectedBooks((books) => [...books, book]);
  };

  const removeBook = (book: Book) => {
    setSelectedBooks((books) => _.without(books, book));
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <Button className="mx-auto mt-8 cursor-pointer bg-primary">
          <CirclePlus />
          <span>Create a collection</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] sm:max-w-[60vw] lg:max-w-[43vh] max-h-[90vh] flex flex-col">
        {isLoading ? (
          <span>Loading</span>
        ) : (
          <>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <DialogHeader>
                  <DialogTitle className="text-2xl text-center">
                    Add title and search for books
                  </DialogTitle>
                </DialogHeader>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title of the collection</FormLabel>
                      <FormControl>
                        <Input placeholder="My Collection" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Public</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="cursor-pointer"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
            <Books
              books={selectedBooks}
              containerClass="justify-start! oveflow-y-hidden overflow-x-auto gap-4! pb-2 scrollbar shrink-0"
              bookContainerClass="w-1/4 p-3!"
              titleClass="text-base!"
            />

            <div>
              <p className="text-sm font-medium">
                Search books to add to this collection
              </p>
              <Search
                containerClasses="px-0 mt-1.5"
                listContainerClass="shadow-none relative!"
                bookContainerClass="pl-0"
                inputClass="py-2 px-3"
                onAdd={addBook}
                onRemove={removeBook}
                selectedBooks={selectedBooks}
              />
            </div>

            <DialogFooter>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                className="cursor-pointer"
              >
                Save
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
