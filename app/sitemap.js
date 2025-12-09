import { MetadataRoute } from "next";

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://itan.app";

  // Fetch all book IDs for dynamic pages
  let books = [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/books/storefront/all`
    );
    const json = await res.json();
    books = json.data || [];
  } catch (err) {
    books = [];
  }

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date().toISOString(),
    },
    ...books.map((book) => ({
      url: `${baseUrl}/home/book-details/${book.id}`,
      lastModified: book.attributes?.updated_at || new Date().toISOString(),
    })),
  ];
}
