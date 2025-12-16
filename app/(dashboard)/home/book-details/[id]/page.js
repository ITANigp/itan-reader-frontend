import Image from "next/image";
import BookDetailsClient from "./BookDetailsClient";

/**
 * Revalidate every 1 hour (ISR)
 * SEO + performance friendly
 */
export const revalidate = 3600;

/* ---------------------------
   SEO METADATA (SERVER)
---------------------------- */
export async function generateMetadata({ params }) {
  const { id } = params;
  const API_URL = "https://api.itan.app/api/v1";

  if (!API_URL) {
    return {};
  }

  const res = await fetch(`${API_URL}/books/${id}/storefront`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) return {};

  const json = await res.json();
  const book = json.data.attributes;

  const description = book.description?.slice(0, 160);

  return {
    title: `${book.title} — ${book.author?.name ?? "Unknown Author"}`,
    description,
    openGraph: {
      title: book.title,
      description,
      images: book.cover_image_url ? [book.cover_image_url] : [],
      type: "book",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/* ---------------------------
   PAGE CONTENT (SERVER)
---------------------------- */
export default async function BookDetailsPage({ params }) {
  const { id } = params;
  const API_URL = "https://api.itan.app/api/v1";

  if (!API_URL) {
    return <div>Server configuration error</div>;
  }

  const res = await fetch(`${API_URL}/books/${id}/storefront`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return <div>Book not found</div>;
  }

  const json = await res.json();

  const book = {
    ...json.data.attributes,
    unique_book_id: json.data.id,
  };

  return (
    <>
      {/* ✅ Structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Book",
            name: book.title,
            author: book.author?.name,
            image: book.cover_image_url,
            description: book.description,
            genre: book.categories?.[0]?.main ?? "",
            offers: {
              "@type": "Offer",
              price: book.ebook_price,
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
            },
          }),
        }}
      />

      {/* Client component */}
      <BookDetailsClient book={book} />
    </>
  );
}
