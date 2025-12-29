import BookDetailsClient from "./BookDetailsClient";

export async function generateMetadata({ params }) {
  const { slug } = params;
  const apiUrl = process.env.API_URL;

  const res = await fetch(
    `${apiUrl}/books/by-slug/${encodeURIComponent(slug)}`,
    { cache: "no-cache" }
  );

  if (!res.ok) return {};

  const json = await res.json();
  const data = json.data || json.book || json;
  if (!data) return {};

  const book = data.attributes ?? data;

  return {
    metadataBase: new URL("https://itan.app"),
    title: `${book.title} — ${book.author?.name || "Author"}`,
    description: book.description?.slice(0, 160),
    alternates: {
      canonical: `https://itan.app/bookstore/${slug}`,
    },
    openGraph: {
      title: book.title,
      description: book.description?.slice(0, 160),
      images: book.cover_image_url ? [book.cover_image_url] : [],
      type: "book",
    },
    robots: { index: true, follow: true },
  };
}



export default async function BookDetailsPage({ params }) {
  const { slug } = params; // params is a plain object
  const apiUrl = "http://itan.app/api/v1";

  try {
    const res = await fetch(
      `${apiUrl}/books/by-slug/${encodeURIComponent(slug)}`,
      { cache: "no-cache" }
    );

    if (!res.ok) {
      console.log("❌ BookDetailsPage: response not OK", res.status);
      throw new Error("Book not found");
    }

    const json = await res.json();

    // 🔍 DEBUG
    console.log(
      "🔍 BookDetailsPage RAW RESPONSE:",
    //   JSON.stringify(json, null, 2)
    json
    );

    const data = json.data || json.book || json;

    if (!data) {
      console.log("❌ BookDetailsPage: data is missing");
      throw new Error("Book not found");
    }

    const book = {
      ...(data.attributes ?? data),
      unique_book_id: data.id,
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Book",
              name: book.title,
              author: {
                "@type": "Person",
                name: book.author?.name,
              },
              image: book.cover_image_url,
              description: book.description,
              url: `https://itan.app/bookstore/${slug}`,
              offers: book.ebook_price && {
                "@type": "Offer",
                price: book.ebook_price,
                priceCurrency: "USD",
                availability: "https://schema.org/InStock",
              },
            }),
          }}
        />

        <BookDetailsClient book={book} />
      </>
    );
  } catch (err) {
    console.error("❌ BookDetailsPage: unexpected error", err);
    throw new Error("Book not found");
  }
}
