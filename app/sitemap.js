import { cache } from "react";

// Cached fetch to avoid hammering your API
const getBooks = cache(async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/books/storefront/all`,
      {
        // Cache for 12 hours on server
        next: { revalidate: 43200 },
      }
    );

    if (!res.ok) return [];

    const json = await res.json();
    return json.data || [];
  } catch (_) {
    return [];
  }
});

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://itan.app";

  const books = await getBooks();
  const now = new Date().toISOString();

  const staticRoutes = ["/", "/home", "/categories", "/about", "/contact"].map(
    (path) => ({
      url: `${baseUrl}${path}`,
      lastModified: now,
    })
  );

  const bookRoutes = books.map((book) => ({
    url: `${baseUrl}/home/book-details/${book.id}`,
    lastModified: book.attributes?.updated_at || now,
  }));

  return [...staticRoutes, ...bookRoutes];
}
