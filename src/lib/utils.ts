import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format number with commas for better readability
 * @param value - Number to format
 * @returns Formatted string with commas
 */
export function formatNumber(value: number): string {
  return value.toLocaleString();
}

/**
 * Parse formatted number string back to number
 * @param value - Formatted number string
 * @returns Parsed number
 */
export function parseFormattedNumber(value: string): number {
  return parseFloat(value.replace(/,/g, '')) || 0;
}