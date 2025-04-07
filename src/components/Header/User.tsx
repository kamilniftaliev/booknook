"use client";

import { SignUp } from "./SignUp";
import { LogIn } from "./LogIn";
import { useAuth } from "../AuthContext";
import { Profile } from "./Profile";

export function User() {
  const { user } = useAuth();

  return (
    <div className="flex gap-2">
      {user ? (
        <Profile />
      ) : (
        <>
          <SignUp />
          <LogIn />
        </>
      )}
    </div>
  );
}
