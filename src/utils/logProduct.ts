import type { Product, SwipeDirection } from "../types";

export function logProduct(direction: SwipeDirection, id: Product['id']) {
  if (direction === 'up') {
    console.log(`Add to cart Product ID: ${id}`);
  } else if (direction === 'right') {
    console.log(`Liked Product ID: ${id}`);
  } else {
    console.log(`Passed Product ID: ${id}`);
  }
}