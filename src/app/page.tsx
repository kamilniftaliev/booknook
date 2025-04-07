import { Header, TrendingBooks } from "@/components";
import { COVER_IMAGE_CLASSES } from "@/constants";
import _ from "lodash";

export default function Home() {
  const coverImageClass = _.sample(COVER_IMAGE_CLASSES);

  return (
    <>
      <div
        className={`flex inset-shadow-[0_-200px_200px_rgba(0,0,0,0.8)] flex-col h-[50vh] bg-cover bg-center ${coverImageClass}`}
      >
        <Header />
      </div>
      <main className="py-20">
        <TrendingBooks />
      </main>
    </>
  );
}
