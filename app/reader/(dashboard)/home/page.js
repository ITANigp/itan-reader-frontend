// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";

// import { api } from "@/utils/auth/readerApi";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// // Import the LikeButton component
// import LikeButton from "@/components/LikeButton"; // Adjust path as per your project structure
// import BuyButton from "@/components/reader/BuyButton";
// import Link from "next/link";


// export default function Home({ initialReaderToken, initialBookId }) {
//   // Placeholder for userToken. In a real app, this would come from your auth context/store.
//   const [userToken, setUserToken] = useState(initialReaderToken || null);
//   const [authUrl, setAuthUrl] = useState("");
//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Simulate logging in to get a userToken (REMOVE IN PRODUCTION, USE ACTUAL AUTH)
//   useEffect(() => {
//     // This is a placeholder. In a real application, you would
//     // get the user token from your authentication system (e.g., localStorage, context API, Redux).
//     const storedToken = localStorage.getItem("access_token");
//     if (storedToken) {
//       setUserToken(storedToken);
//     } else {
//       // Simulate a login if no token exists for demonstration purposes
//       // This is not secure or how auth generally works.
//       // For testing the LikeButton, you might manually set a token in localStorage
//       // or implement a mock login.
//       console.warn("No user token found. Like button will be disabled.");
//     }
//   }, []);

//   useEffect(() => {
//     const fetchBooks = async () => {
//       try {
//         const response = await fetch("http://localhost:3000/api/v1/books");
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const result = await response.json();
//         console.log("All books from the Home: ", result)
//         const formattedBooks = result.data.map((book) => ({
//           id: book.id,
//           type: book.type, // Keep type if needed
//           title: book.attributes.title,
//           author: book.attributes.author.name,
//           price: book.attributes.ebook_price,
//           image: book.attributes.cover_image_url,
//           categories: book.attributes.categories,
//           approval_status: book.attributes.approval_status,
//           author_id: book.attributes.author.id, // Keep author ID if needed
//           average_rating: book.attributes.average_rating,
//           likes_count: book.attributes.likes_count,
//         }));
//         setBooks(formattedBooks);
//       } catch (err) {
//         console.error("Failed to fetch books:", err);
//         setError("Failed to load books. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBooks();
//   }, []);

//   const handlePurchase = async (bookIdToPurchase) => {
//     // This function assumes `createPurchase` is globally available or imported
//     // You might need to pass `readerToken` from the component's state or props
//     // if `createPurchase` needs it.
//     if (!userToken) {
//       alert("Please log in to purchase a book.");
//       return;
//     }
//     try {
//       // This createPurchase function is not defined in the provided context.
//       // You'll need to ensure it's imported or defined elsewhere.
//       // For demonstration, let's assume it exists and takes userToken and bookId
//       // const res = await createPurchase(userToken, bookIdToPurchase);
//       // setAuthUrl(res.authorization_url);
//       // window.location.href = res.authorization_url; // redirect to Paystack
//       console.log(`Attempting to purchase book ID: ${bookIdToPurchase}`);
//       alert(
//         `Purchase functionality is not fully implemented yet. Book ID: ${bookIdToPurchase}`
//       );
//     } catch (err) {
//       console.error("Purchase failed:", err);
//       alert("Purchase failed: " + err.message);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Loading books...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-red-600">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Hero Section */}
//       <div className="w-full h-64 md:h-96 relative">
//         <Image
//           src="/images/readers/home-hero.png"
//           alt="Hero"
//           fill
//           className="object-cover"
//         />
//       </div>

//       {/* Genres */}
//       <section className="px-6 py-8">
//         <h2 className="text-2xl font-semibold mb-4">Genres</h2>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           {Array(4)
//             .fill(0)
//             .map((_, idx) => (
//               <div
//                 key={idx}
//                 className="relative h-40 rounded-lg overflow-hidden shadow-md"
//               >
//                 <Image
//                   src="/images/readers/home-hero.png"
//                   alt="Genre" // Make this more specific if possible
//                   fill
//                   className="object-cover"
//                 />
//                 <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
//                   <span className="text-white font-semibold text-lg">
//                     Romance{" "}
//                     {/* Placeholder, make dynamic if genre data is available */}
//                   </span>
//                 </div>
//               </div>
//             ))}
//         </div>
//       </section>

//       {/* Popular Trending */}
//       <section className="px-6 pb-12">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-2xl font-semibold">Popular Trending</h2>
//           <a href="#" className="text-sm text-red-500">
//             See more →
//           </a>
//         </div>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 ">
//           {books.map((book) => (
//             <Card key={book.id} className="relative w-[200px]">
//               {/* Integrate the LikeButton here */}
//               <div className="absolute top-2 right-2 text-blue-500 w-6 h-6 cursor-pointer bg-slate-100 rounded-full p-1">
//                 <LikeButton bookId={book.id} userToken={userToken} />
//               </div>
//               <CardContent className="py-2">
//                 <Image
//                   src={book.image}
//                   alt={book.title}
//                   width={150}
//                   height={250}
//                   className="mx-auto mb-3"
//                 />
//                 <h3 className="font-bold text-sm text-center">{book.title}</h3>
//                 <p className="text-xs text-center text-gray-500">
//                   By: {book.author === " " ? "Unknown Author" : book.author}
//                 </p>
//                 <div className="text-center text-green-600 font-semibold mt-2">
//                   {Number(book.price) // Check if it's a valid number after parsing
//                     ? (Number(book.price) / 100).toLocaleString("en-US", {
//                         style: "currency",
//                         currency: "USD",
//                       })
//                     : "Price N/A"}
//                 </div>
//                 <div className="flex justify-center mt-2">
//                   <Link
//                     href={`/reader/home/book-details/${book.id}`} // Ensure this matches your BookDetails page path
//                     className="block text-sm text-red-600 mt-2 hover:underline"
//                   >
//                     View details
//                   </Link>
//                   <BuyButton
//                     bookId={book.id}
//                     className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//                   >
//                     Buy now
//                   </BuyButton>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// }





























"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import LikeButton from "@/components/LikeButton";
import Link from "next/link";
import FreeTrialTimer from "../../(components)/FreeTrialTimer";

export default function Home({ initialReaderToken }) {
  const [userToken, setUserToken] = useState(initialReaderToken || null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) setUserToken(storedToken);
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/books");
        const result = await response.json();
        const formattedBooks = result.data.map((book) => ({
          id: book.id,
          title: book.attributes.title,
          author: book.attributes.author.name,
          price: book.attributes.ebook_price,
          image: book.attributes.cover_image_url,
        }));
        setBooks(formattedBooks);
      } catch (err) {
        setError("Failed to load books.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;

  return (
    <div className="bg-white pb-10 text-black text-[14px] font-sans">
      {/* <div className="hidden md:flex max-w-8xl mx-auto px-4 py-5 justify-end"> */}
      <div className="hidden md:flex max-w-[1440px] mx-auto px-4 py-5 justify-end">
        <FreeTrialTimer />
      </div>
      {/* CONTAINER */}
      {/* <div className="max-w-7xl mx-auto px-4">  */}
      {/* <div className="max-w-8xl mx-auto px-4">  */}
      <div className="max-w-[1440px] mx-auto px-4">

        {/* Header */}
        <div className="flex justify-between items-center py-3 mb-2 md:hidden">
          <button className="bg-white w-8 h-8 rounded-full flex items-center justify-center text-base border border-gray-500 text-gray-500">
            ←
          </button>
        </div>

        {/* Hero */}
        <div className="mb-14">
          <div className="w-full h-40 md:h-60 relative rounded-lg overflow-hidden">
            <Image
              src="https://picsum.photos/600/200?grayscale&random=1"
              alt="Hero"
              fill
              className="object-cover"
            />

            {/* Overlay Text */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-center px-4">
              <h1 className="text-white text-base md:text-xl font-semibold leading-snug">
                Explore Untold African Stories in the Most Immersive Way
              </h1>
            </div>
          </div>
        </div>


        {/* Genres */}
        <section className="mt-6 mb-14">
          <h2 className="font-bold text-[27px] mb-4">Genres</h2>
          <div className="flex gap-3 overflow-x-auto no-scrollbar md:gap-4 px-1 -mx-1">
            {[
              "Romance", "Fiction", "Adventure", "Sci-Fi", "Mystery", "Horror",
              "Fantasy", "Thriller", "Biography", "Historical", "Poetry", "Drama"
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


        {/* Popular Trending */}
        <section className="mt-8 mb-14">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-[27px] mb-4">Popular Trending </h2>
            <span className="text-red-600 text-xs cursor-pointer">See more →</span>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar md:overflow-x-auto">
            {books.map((book, index) => (
              <div
                key={index}
                className="w-[150px] sm:w-[130px] lg:w-[180px] bg-white p-2 rounded relative flex-shrink-0 md:shadow-md"
              >
                <div className="absolute top-2 right-2 z-10">
                  <div className="bg-white rounded-full w-1 h-1 flex items-center justify-center">
                    <LikeButton bookId={book.id} userToken={userToken} />
                  </div>
                </div>

                {/* Book Image */}
                <div className="w-full h-[220px] lg:h-[260px] relative rounded overflow-hidden mb-2">
                  <Image
                    src={book.image || `https://picsum.photos/150/220?random=${index + 20}`}
                    alt={book.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>

                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-red-500 text-xs">★</span>
                  ))}
                </div>

                {/* Title & Author */}
                <p className="text-sm font-bold leading-snug">{book.title}</p>
                <p className="text-xs text-gray-500 mb-1">
                  By: {book?.author?.trim() ? book.author : "Jane Doe"}
                </p>

                {/* Price and View Button */}
                <div className="flex justify-between items-center mt-1">
                  <span className="text-teal-600 font-bold text-[16px]">
                    ${Number(book.price) / 100}
                  </span>
                  <Link
                    href={`/reader/home/book-details/${book.id}`}
                    className="bg-red-600 text-white text-xs font-medium px-2 py-1 rounded-full hover:bg-red-700 transition-colors"
                  >
                    View details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* Continue Reading */}
        <section className="mt-8 mb-14">
          <h2 className="font-bold text-[27px] mb-4">Continue Reading</h2>
          <div
            className="flex gap-[10px] md:gap-[24px] overflow-x-auto no-scrollbar"
            style={{
              width: '100%',
              maxWidth: '1376px',
              height: 'auto',
              opacity: 1,
            }}
          >
            {books.map((book, index) => (
              <div
                key={index}
                className="w-[150px] sm:w-[130px] lg:w-[180px] bg-white p-2 rounded relative flex-shrink-0 md:shadow-md"
              >

                {/* Book Image */}
                <div className="w-full h-[220px] lg:h-[260px] relative rounded overflow-hidden mb-2">
                  <Image
                    src={book.image || `https://picsum.photos/150/220?random=${index + 20}`}
                    alt={book.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>

                {/* Page and continue Button */}
                <div className="flex flex-col justify-center items-center mt-1">

                  <p className="text-xs text-gray-600 mb-1">Page 25 of 283</p>

                  <Button className="bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-7 py-1 rounded">
                    Continue
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* Recommended for you */}
        <section className="mt-8 mb-14">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-[27px] mb-4">Recommended for you</h2>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar md:overflow-x-auto">
            {books.map((book, index) => (
              <div
                key={index}
                className="w-[150px] sm:w-[130px] lg:w-[180px] bg-white p-2 rounded relative flex-shrink-0 md:shadow-md"
              >
                <div className="absolute top-2 right-2 z-10">
                  <div className="bg-white rounded-full w-1 h-1 flex items-center justify-center">
                    <LikeButton bookId={book.id} userToken={userToken} />
                  </div>
                </div>

                {/* Book Image */}
                <div className="w-full h-[220px] lg:h-[260px] relative rounded overflow-hidden mb-2">
                  <Image
                    src={book.image || `https://picsum.photos/150/220?random=${index + 20}`}
                    alt={book.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>

                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-red-500 text-xs">★</span>
                  ))}
                </div>

                {/* Title & Author */}
                <p className="text-sm font-bold leading-snug">{book.title}</p>
                <p className="text-xs text-gray-500 mb-1">
                  By: {book?.author?.trim() ? book.author : "Jane Doe"}
                </p>

                {/* Price and View Button */}
                <div className="flex justify-between items-center mt-1">
                  <span className="text-teal-600 font-bold text-[16px]">
                    ${Number(book.price) / 100}
                  </span>
                  <Link
                    href={`/reader/home/book-details/${book.id}`}
                    className="bg-red-600 text-white text-xs font-medium px-2 py-1 rounded-full hover:bg-red-700 transition-colors"
                  >
                    View details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ITAN Originals */}
        {/* <section className="mt-8">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-[17px]">ITAN Originals</h2>
          </div>
          <div
            className={`
            flex gap-[10px] overflow-x-auto no-scrollbar
            sm:grid sm:grid-cols-[repeat(auto-fill,_minmax(160px,_1fr))] sm:gap-x-[16px] sm:gap-y-[24px] sm:overflow-visible
            lg:grid-cols-[repeat(auto-fill,_minmax(180px,_1fr))] lg:gap-[24px]
           `}
          >
            {books.map((book, index) => (
              <div
                key={index}
                // className="max-w-[180px] w-full bg-white p-2 rounded relative flex-shrink-0 md:shadow-md mx-auto"
                className="max-w-[200px] w-full bg-white p-2 rounded relative flex-shrink-0 md:shadow-md mx-auto"
              >
                <div className="absolute top-1 right-1 z-10 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow">
                  <div className="bg-white rounded-full w-4 h-4 flex items-center justify-center text-red-500">
                    <LikeButton bookId={book.id} userToken={userToken} />
                  </div>
                </div>

                <div className="w-full h-[220px] lg:h-[260px] relative rounded overflow-hidden mb-2">
                  <Image
                    src={book.image || `https://picsum.photos/150/220?random=${index + 20}`}
                    alt={book.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>

                <div className="flex items-center gap-0.5 mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-red-500 text-xs">★</span>
                  ))}
                </div>

                <p className="text-sm font-bold leading-snug">{book.title}</p>
                <p className="text-xs text-gray-500 mb-1">
                  By: {book?.author?.trim() ? book.author : "Jane Doe"}
                </p>

                <div className="flex justify-between items-center mt-1">
                  <span className="text-teal-600 font-bold text-[16px]">
                    ${Number(book.price) / 100}
                  </span>
                  <Link
                    href={`/reader/home/book-details/${book.id}`}
                    className="bg-red-600 text-white text-xs font-medium px-2 py-1 rounded-full hover:bg-red-700 transition-colors"
                  >
                    View details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section> */}

        {/* ITAN Originals */}
        <section className="mt-8 mb-14">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-[27px] mb-4">ITAN Originals</h2>
          </div>
          <div
            className={`
            grid gap-4
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-5
            xl:grid-cols-6
            2xl:grid-cols-7
          `}
          >
            {books.map((book, index) => (
              <div
                key={index}
                className="relative bg-white p-2 rounded md:shadow-md w-full"
              >

                <div className="absolute top-1 right-1 z-10 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow">
                  <div className="bg-white rounded-full w-4 h-4 flex items-center justify-center text-red-500">
                    <LikeButton bookId={book.id} userToken={userToken} />
                  </div>
                </div>

                <div className="w-full h-[220px] relative rounded overflow-hidden mb-2">
                  <Image
                    src={book.image || `https://picsum.photos/150/220?random=${index + 20}`}
                    alt={book.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>

                <div className="flex items-center gap-0.5 mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-red-500 text-xs">★</span>
                  ))}
                </div>

                <p className="text-sm font-bold leading-snug">{book.title}</p>
                <p className="text-xs text-gray-500 mb-1">
                  By: {book?.author?.trim() ? book.author : "Jane Doe"}
                </p>

                <div className="flex justify-between items-center mt-1">
                  <span className="text-teal-600 font-bold text-[16px]">
                    ${Number(book.price) / 100}
                  </span>
                  <Link
                    href={`/reader/home/book-details/${book.id}`}
                    className="bg-red-600 text-white text-xs font-medium px-2 py-1 rounded-full hover:bg-red-700 transition-colors"
                  >
                    View details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}