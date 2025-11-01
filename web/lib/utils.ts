import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combina dinamicamente classes Tailwind com segurança.
 * Exemplo:
 *   cn("bg-primary", isActive && "opacity-70")
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
