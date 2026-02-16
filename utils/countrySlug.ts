// Utility functions for consistent country slug <-> name conversion

export function countryToSlug(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, "-");
}

export function slugToCountry(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}
