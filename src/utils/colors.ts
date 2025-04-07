import { BOOK_COLORS } from "../constants";
import _ from "lodash";

// In order to prevent 2 books next to each other from having
// the same color, we have to store the last selected color
let lastColor: (typeof BOOK_COLORS)[number] | undefined;

export function getRandomColor() {
  const newColor = _.sample(BOOK_COLORS)!;

  if (lastColor && lastColor === newColor) {
    return getRandomColor();
  }

  lastColor = newColor;

  return newColor;
}
