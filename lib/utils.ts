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

  const suffixes = [
    /,\s*UK$/i,
    /,\s*United Kingdom$/i,
    /,\s*GB$/i,
    /,\s*Great Britain$/i,
    /,\s*USA$/i,
    /,\s*United States$/i,
    /,\s*US$/i,
    /,\s*[A-Z]{2}$/, // Two-letter state codes
    /,\s*[A-Z]{2},\s*[A-Z]{2,3}$/, // State + Country (e.g., "NY, USA")
  ]

  let normalized = city.trim()

  const segments = normalized
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)

  if (segments.length > 1) {
    const locality = segments.find(
      (part) => /[a-zA-Z]/.test(part) && !/\d/.test(part)
    )

    normalized = (locality ?? segments[0]).trim()
  }

  for (const suffix of suffixes) {
    normalized = normalized.replace(suffix, '')
  }

  normalized = normalized.replace(/,\s*$/, '').trim()

  return normalized
}

