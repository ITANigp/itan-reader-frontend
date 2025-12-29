import { cache } from "react";

const getBooks = cache(async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/books/storefront_all`,
      { next: { revalidate: 43200 } } // 12 hours
    );

    if (!res.ok) return [];

    const json = await res.json();
    return json?.data || [];
  } catch {
    return [];
  }
});

/** @type {import('next').MetadataRoute.Sitemap} */
export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://itan.app";
  const now = new Date();

  const staticRoutes = ["/", "/bookstore"].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
  }));

  const books = await getBooks();

  const bookRoutes = books
    .filter((book) => book?.attributes?.slug)
    .map((book) => ({
      url: `${baseUrl}/bookstore/${book.attributes.slug}`,
      lastModified: new Date(book.attributes?.updated_at || Date.now()),
    }));

  return [...staticRoutes, ...bookRoutes];
}
