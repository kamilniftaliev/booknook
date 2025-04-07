"use client";

import { Header, useAuth } from "@/components";
import { LoaderCircle } from "lucide-react";

import { ProfileForm } from "./Form";

export default function Profile() {
  const { isLoading } = useAuth();

  return (
    <>
      <Header />
      <main className="pt-[10vh]">
        {isLoading ? (
          <LoaderCircle size={30} className="mx-auto opacity-60 animate-spin" />
        ) : (
          <ProfileForm />
        )}
      </main>
    </>
  );
}
