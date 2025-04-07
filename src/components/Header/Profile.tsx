import Link from "next/link";
import { User } from "lucide-react";

import { useAuth } from "../AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Profile() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex gap-2 px-4 py-2 font-bold text-white bg-red-500 rounded-md cursor-pointer focus-visible:outline-0">
        <User />
        <span className="text-nowrap">{user.name}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-3">
        <DropdownMenuItem asChild>
          <Link className="cursor-pointer" href="/profile">
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link className="cursor-pointer" href="/collections">
            My Collections
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={logout}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
