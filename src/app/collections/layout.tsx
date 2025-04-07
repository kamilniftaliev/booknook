"use client";

import { Header } from "@/components";
import { CollectionsProvider } from "./CollectionsContext";

export default function Collections({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="flex justify-center py-[3vh] px-[3vw]">
        <CollectionsProvider>{children}</CollectionsProvider>
      </main>
    </>
  );
}
