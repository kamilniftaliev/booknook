import { APP_NAME } from "@/constants";
import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex gap-2 items-center shrink-0">
      <Image src="/images/logo.svg" alt={APP_NAME} width={30} height={25} />
      <span className="font-bold text-white">{APP_NAME}</span>
    </Link>
  );
}
