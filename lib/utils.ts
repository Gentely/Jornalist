import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function formatLYD(n: number) { return `${n.toLocaleString("ar-LY")} د.ل`; }
export function whatsappLink(message: string) {
  return `https://wa.me/218918199601?text=${encodeURIComponent(message)}`;
}
