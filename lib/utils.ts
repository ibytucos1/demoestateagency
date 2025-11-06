import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normalize city name by removing country suffixes and extra formatting
 * Examples:
 * - "London, UK" -> "London"
 * - "London, United Kingdom" -> "London"
 * - "New York, NY, USA" -> "New York"
 * - "Manchester" -> "Manchester"
 */
export function normalizeCityName(city: string): string {
  if (!city) return city
  
  // Remove common country suffixes
  const suffixes = [
    /,\s*UK$/i,
    /,\s*United Kingdom$/i,
    /,\s*GB$/i,
    /,\s*Great Britain$/i,
    /,\s*USA$/i,
    /,\s*United States$/i,
    /,\s*US$/i,
    // Remove state/province suffixes (e.g., "New York, NY" -> "New York")
    /,\s*[A-Z]{2}$/, // Two-letter state codes
    /,\s*[A-Z]{2},\s*[A-Z]{2,3}$/, // State + Country (e.g., "NY, USA")
  ]
  
  let normalized = city.trim()
  
  // Apply each suffix pattern
  for (const suffix of suffixes) {
    normalized = normalized.replace(suffix, '')
  }
  
  // Clean up any trailing commas or spaces
  normalized = normalized.replace(/,\s*$/, '').trim()
  
  return normalized
}

