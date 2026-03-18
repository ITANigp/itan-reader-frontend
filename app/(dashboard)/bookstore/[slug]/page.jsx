import BookDetailsClient from "./BookDetailsClient";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const apiUrl = "https://api.itan.app/api/v1";

  const res = await fetch(
    `${apiUrl}/books/by-slug/${encodeURIComponent(slug)}`,
    { cache: "no-cache" }
  );

  if (!res.ok) return {};

  const json = await res.json();
  const data = json.data;
  if (!data) return {};

  const book = data.attributes ?? data;

  return {
    metadataBase: new URL("https://api.itan.app"),
    title: `${book.title} — ${book.author?.name || "Author"}`,
    description: book.description?.slice(0, 160),
    alternates: {
      canonical: `https://api.itan.app/bookstore/${slug}`,
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
  const { slug } = await params; // params is a plain object
  const apiUrl = "https://api.itan.app/api/v1";

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


    const data = json.data; // This is the standard JSON:API structure

    if (!data) {
      console.log("❌ BookDetailsPage: data is missing");
      throw new Error("Book not found");
    }

   const book = {
     ...data.attributes,
     unique_book_id: data.id, // Now data.id will exist!
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
              url: `http://localhost:3000/bookstore/${slug}`,
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
