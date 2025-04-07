import { cn, getRandomColor } from "@/utils";
import { Button } from "@/components/ui/button";
import { Book } from "@/types";

interface Props {
  books?: Book[];
  containerClass?: string;
  bookContainerClass?: string;
  titleClass?: string;
  shouldShowAddButton?: boolean;
}

export function Books({
  books,
  bookContainerClass,
  titleClass,
  containerClass,
  shouldShowAddButton = false,
}: Props) {
  if (!books?.length) return null;

  return (
    <div
      className={cn(
        "flex gap-10 justify-center items-start lg:gap-20",
        containerClass
      )}
    >
      {books.map(({ _id, id, title, authors, imageUrl }) => {
        const color = getRandomColor();

        return (
          <div
            key={_id || id.toString()}
            className={cn(
              `flex cursor-pointer hover:scale-[102%] hover:shadow-xl transition-all flex-col w-[20vw] grow-0 shrink-0 items-center gap-3 py-3 lg:py-6.5 px-3 lg:px-6 ${color.bg} rounded-2xl`,
              bookContainerClass
            )}
          >
            <span
              className="w-full rounded-2xl aspect-[2/3] bg-cover bg-center "
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
            <div className="flex flex-col w-full">
              <h3
                className={cn(
                  `text-lg lg:text-2xl truncate text-nowrap font-medium text-center ${color.title}`,
                  titleClass
                )}
              >
                {title}
              </h3>
              {authors && (
                <h4
                  className={`text-sm lg:text-md text-center text-nowrap truncate ${color.author}`}
                >
                  {authors}
                </h4>
              )}
              {shouldShowAddButton && (
                <Button className="mt-1.5 cursor-pointer">
                  Add to collection
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
