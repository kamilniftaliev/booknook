import { Search } from "../Search";
import { Logo } from "./Logo";
import { User } from "./User";

export function Header() {
  return (
    <header className="flex justify-between items-center px-5 py-2.5 w-full bg-primary">
      <Logo />
      <Search
        containerClasses="w-screen md:w-[50vw] lg:w-[33vw]"
        bookContainerClass="max-w-[92vw] md:max-w-[50vw] lg:max-w-[33vw]"
        listContainerClass="absolute shadow-xl w-[47vw] lg:w-[30vw]"
      />
      <User />
    </header>
  );
}
