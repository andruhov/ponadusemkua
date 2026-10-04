import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function asset(path: string) {
  const base = import.meta.env.BASE_URL || "/";
  return `${base}${path.replace(/^\//, "")}`;
}

/** Public file path with spaces/parentheses encoded (`photo (1).jpg`). */
export function mediaAsset(path: string) {
  const trimmed = path.replace(/^\//, "");
  return asset(trimmed.split("/").map(encodeURIComponent).join("/"));
}
