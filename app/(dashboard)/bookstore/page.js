import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "African Bookstore | Buy African Books Online – Itan",
  description:
    "Discover and buy African books across fiction, romance, children, business, and more. Read authentic African stories on Itan.",
  alternates: {
    canonical: "https://itan.app/bookstore",
  },
  robots: {
    index: true,
    follow: true,
  },
};


async function getBooks() {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const response = await fetch(`${BASE_URL}/books/all_storefront`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) throw new Error("Failed to fetch books");
    const result = await response.json();

    // Safety check: ensure result.data exists
    const booksData = result.data || [];

    return booksData.map((book) => ({
      id: book.id,
      title: book.attributes.title,
      author: book.attributes.author?.name || "Unknown Author",
      slug: book.attributes.slug,
      price: book.attributes.ebook_price,
      image: book.attributes.cover_image_url,
      mainCategories: Array.isArray(book.attributes.categories)
        ? book.attributes.categories.map((cat) => cat.main).filter(Boolean)
        : [],
    }));
  } catch (error) {
    console.error("Data fetching error:", error);
    return [];
  }
}

export default async function Home() {
  const books = await getBooks();

  const booksByGenre = books.reduce((acc, book) => {
    const genres = book.mainCategories.length
      ? book.mainCategories
      : ["Itan Originals"];
    genres.forEach((genre) => {
      if (!acc[genre]) acc[genre] = [];
      if (!acc[genre].some((b) => b.id === book.id)) {
        acc[genre].push(book);
      }
    });
    return acc;
  }, {});

  return (
    <div className="bg-white pb-10 text-black text-[14px] font-sans">
      
      {/* ✅ ADD BOOKLIST SCHEMA RIGHT HERE */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "African Bookstore – Itan",
            description:
              "Browse and buy African books across fiction, romance, children, business, and more.",
            url: "https://itan.app/bookstore",
            itemListElement: books.map((book, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: `https://itan.app/bookstore/${book.slug}`,
              name: book.title,
            })),
          }),
        }}
      />

      <div className="max-w-[1440px] mx-auto px-4 pt-5">
        {/* Hero Section */}
        <header className="mb-14">
          <div className="w-full h-40 md:h-60 xl:h-96 relative rounded-lg overflow-hidden">
            <Image
              src="/images/readers/home-hero.png"
              alt="Hero"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <h1 className="text-white text-xl font-bold">
                Explore Untold African Stories
              </h1>
            </div>
          </div>
        </header>
        <section className="mt-6 mb-16">
          <h2 className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl mb-4">
            Genres
          </h2>
          <div className="flex gap-3 overflow-x-auto scrollbar scrollbar-thumb-gray-400 scrollbar-track-gray-100 md:gap-4 px-1 -mx-1">
            {[
              "Romance",
              "Fiction",
              "Sci-Fi",
              "Mystery",
              "Horror",
              "Fantasy",
              "Thriller",
            ].map((genre, idx) => (
              <div
                key={idx}
                className="relative min-w-[160px] h-[90px] md:min-w-[200px] md:h-[110px] rounded overflow-hidden shrink-0"
              >
                <Image
                  src={`https://picsum.photos/200/100?random=${idx + 10}`}
                  alt={genre}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-sm font-medium">
                  {genre}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Ebooks based on genre */}
        {Object.entries(booksByGenre).map(([genre, genreBooks]) => (
          <section key={genre} className="mt-8 mb-10">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-[17px]">{genre}</h2>
              {/* You can add a 'See more' link or button here if needed */}
            </div>
            <div className="flex gap-4 overflow-x-auto scrollbar scrollbar-thumb-gray-400 scrollbar-track-gray-100">
              {genreBooks.length ? (
                genreBooks.map((book, index) => {
                  // const isLiked = likedBookIds.includes(String(book.id));
                  return (
                    <div
                      key={`${genre}-${book.id}`}
                      className="w-[150px] sm:w-[130px] lg:w-[180px] bg-white p-2 rounded relative flex-shrink-0 md:shadow-md"
                    >
                      {/* <div className="absolute top-2 right-2 z-10">
                        <div className="bg-white rounded-full w-1 h-1 flex items-center justify-center">
                          <LikeButton
                            bookId={String(book.id)}
                            userToken={userToken}
                            section={genre}
                            isLiked={isLiked}
                          />
                        </div>
                      </div> */}
                      <div className="w-full h-[220px] lg:h-[260px] relative rounded overflow-hidden mb-2">
                        <Image
                          src={
                            book.image ||
                            `https://picsum.photos/150/220?random=${index + 20}`
                          }
                          alt={`${book.title} book cover by ${book.author}`}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex items-center gap-0.5 mb-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className="text-red-500 text-xs">
                            ★
                          </span>
                        ))}
                      </div>
                      <p className="text-sm font-bold leading-snug">
                        {book.title}
                      </p>
                      <p className="text-xs text-gray-500 mb-1">
                        By: {book?.author?.trim() ? book.author : "Jane Doe"}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-teal-600 font-bold text-[16px]">
                          ${Number(book.price).toFixed(2)}
                        </span>
                        <Link
                          href={`/bookstore/${book.slug}`}
                          aria-label={`View ${book.title} by ${book.author}`}
                          className="bg-red-600 text-white text-xs font-medium px-2 py-1 rounded-full hover:bg-red-700 transition-colors"
                        >
                          View details
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500">No books found in this genre.</p>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}