import axios from "axios";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

/* -------------------- CLASSNAME UTILITY -------------------- */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/* -------------------- AXIOS FETCHING EXAMPLE -------------------- */
export async function fetchExampleData() {
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/posts"
    );
    return response.data;
  } catch (error) {
    console.error("Axios fetch error:", error);
    return [];
  }
}
