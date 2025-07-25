// "use client";

// import React from "react";
// import { useRouter } from "next/navigation";

// import dynamic from "next/dynamic";

// // Dynamically import the PdfFlipbook component with ssr: false
// // This ensures it only runs on the client, as react-pdf and react-pageflip
// // rely on browser APIs.
// const PdfFlipbook = dynamic(() => import("@/components/PdfFlipbook"), {
//   ssr: false,
//   loading: () => <p>Loading flipbook viewer...</p>, // Optional loading state
// });

// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Heart, PlayCircle } from "lucide-react";

// const books = [
//   {
//     title: "Rise of the Jumbies",
//     author: "Tracey Baptiste",
//     cover: "/images/books/book4.png",
//     price: 27,
//     isVideo: false,
//   },
//   {
//     title: "Glory",
//     author: "NoViolet Bulawayo",
//     cover: "/images/books/book4.png",
//     price: 27,
//     isVideo: false,
//   },
//   {
//     title: "You made a Fool...",
//     author: "Akwaeke Emezi",
//     cover: "/images/books/book4.png",
//     price: 27,
//     isVideo: true,
//   },
//   {
//     title: "Gaslight",
//     author: "Femi Kayode",
//     cover: "/images/books/book4.png",
//     price: 25,
//     isVideo: false,
//   },
//   {
//     title: "Death of the Author",
//     author: "Nnedi Okorafor",
//     cover: "/images/books/book4.png",
//     price: 27,
//     isVideo: false,
//   },
//   {
//     title: "The Lazarus Effect",
//     author: "H.J. Golakai",
//     cover: "/images/books/book4.png",
//     price: 27,
//     isVideo: false,
//   },
//   {
//     title: "In Bed With Her Guy",
//     author: "Yinka Akiran",
//     cover: "/images/books/book4.png",
//     price: 20,
//     isVideo: false,
//   },
//   {
//     title: "Really good, actually",
//     author: "Monica Heisey",
//     cover: "/images/books/book4.png",
//     price: 27,
//     isVideo: true,
//   },
// ];

// export default function Library() {
//   const router = useRouter();
//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6">Library</h1>
//       <div className="flex gap-4 mb-6">
//         {["All", "Wishlist", "Ebook", "Audiobooks", "Finished Books"].map(
//           (tab, i) => (
//             <button
//               key={i}
//               className={`px-4 py-2 rounded-md shadow ${
//                 i === 0 ? "bg-red-600 text-white" : "bg-white text-black"
//               }`}
//             >
//               {tab}
//             </button>
//           )
//         )}
//       </div>
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//         {books.map((book, index) => (
//           <Card key={index} className="relative">
//             <div className="absolute top-2 right-2 text-red-500">
//               <Heart size={18} fill="white" />
//             </div>
//             <div className="relative">
//               <img
//                 src={book.cover}
//                 alt={book.title}
//                 className="w-full h-60 object-cover rounded-t-xl"
//               />
//               {book.isVideo && (
//                 <PlayCircle
//                   className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white bg-black/50 rounded-full"
//                   size={40}
//                 />
//               )}
//             </div>
//             <CardContent className="p-4">
//               <h2 className="text-sm font-semibold leading-tight">
//                 {book.title}
//               </h2>
//               <p className="text-xs text-gray-500 mb-2">By: {book.author}</p>
//               <div className="flex items-center gap-2">
//                 {[...Array(5)].map((_, i) => (
//                   <span key={i} className="text-red-500">
//                     ★
//                   </span>
//                 ))}
//               </div>
//               {book.price && (
//                 <div className="mt-3">
//                   <div className="text-sm font-semibold text-red-600 mb-1">
//                     ${book.price}
//                   </div>
//                   <Button
//                     onClick={() => <PdfFlipbook pdfUrl="/CYBERSECURITY.pdf" />}
//                     className="w-full bg-[#E50913]"
//                   >
//                     Read Book
//                   </Button>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }











































// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import dynamic from "next/dynamic";
// import { useAuth } from "@/contexts/AuthContext";
// import { api } from "@/utils/auth/readerApi";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Heart, PlayCircle } from "lucide-react";

// const PdfFlipbook = dynamic(() => import("@/components/PdfFlipbook"), {
//   ssr: false,
//   loading: () => <p>Loading flipbook viewer...</p>,
// });

// const TABS = ["All", "Wishlist", "Ebook", "Audiobooks", "Finished Books"];

// export default function Library() {
//   const router = useRouter();
//   const { authToken, isLoggedIn } = useAuth();
//   const [activeTab, setActiveTab] = useState(0);
//   const [finishedBooks, setFinishedBooks] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [allBooks, setAllBooks] = useState([]);
//   const [wishlistBooks, setWishlistBooks] = useState([]);

//   // Placeholder for other tabs
//   const books = [
//     {
//       title: "Rise of the Jumbies",
//       author: "Tracey Baptiste",
//       cover: "/images/books/book4.png",
//       price: 27,
//       isVideo: false,
//     },
//     {
//       title: "Glory",
//       author: "NoViolet Bulawayo",
//       cover: "/images/books/book4.png",
//       price: 27,
//       isVideo: false,
//     },
//     {
//       title: "You made a Fool...",
//       author: "Akwaeke Emezi",
//       cover: "/images/books/book4.png",
//       price: 27,
//       isVideo: true,
//     },
//     {
//       title: "Gaslight",
//       author: "Femi Kayode",
//       cover: "/images/books/book4.png",
//       price: 25,
//       isVideo: false,
//     },
//     {
//       title: "Death of the Author",
//       author: "Nnedi Okorafor",
//       cover: "/images/books/book4.png",
//       price: 27,
//       isVideo: false,
//     },
//     {
//       title: "The Lazarus Effect",
//       author: "H.J. Golakai",
//       cover: "/images/books/book4.png",
//       price: 27,
//       isVideo: false,
//     },
//     {
//       title: "In Bed With Her Guy",
//       author: "Yinka Akiran",
//       cover: "/images/books/book4.png",
//       price: 20,
//       isVideo: false,
//     },
//     {
//       title: "Really good, actually",
//       author: "Monica Heisey",
//       cover: "/images/books/book4.png",
//       price: 27,
//       isVideo: true,
//     },
//   ];

//   useEffect(() => {
//     if (TABS[activeTab] === "Finished Books" && isLoggedIn && authToken) {
//       console.log("[Library] Fetching finished books from API", {
//         activeTab: TABS[activeTab],
//         isLoggedIn,
//         authTokenPresent: !!authToken,
//       });
//       setLoading(true);
//       setError(null);
//       api
//         .get("/reader/finished_books", {
//           headers: { Authorization: `Bearer ${authToken}` },
//         })
//         .then((res) => {
//           console.log("[Library] API response for finished books:", res);
//           setFinishedBooks(res.data.data || []);
//         })
//         .catch((err) => {
//           console.error("[Library] Error fetching finished books:", err);
//           if (err.response) {
//             console.error("[Library] Error response data:", err.response.data);
//           }
//           setError(
//             err.response?.data?.message || "Failed to load finished books."
//           );
//         })
//         .finally(() => {
//           setLoading(false);
//           console.log("[Library] Finished books fetch process finished.");
//         });
//     } else if (TABS[activeTab] === "All") {
//       // Fetch all books for the 'All' tab
//       console.log("[Library] Fetching all books from /api/v1/books");
//       // console.log("[Library] Fetching all books from /purchases");
//       setLoading(true);
//       setError(null);
//       api
//         .get("/purchases")
//         // .get("/books/my_books")
//         .then((res) => {
//           console.log("[Library] API response for all books:", res);
//           setAllBooks(res.data.data || []);
//         })
//         .catch((err) => {
//           console.error("[Library] Error fetching all books:", err);
//           if (err.response) {
//             console.error("[Library] Error response data:", err.response.data);
//           }
//           setError(
//             err.response?.data?.message || "Failed to load books."
//           );
//         })
//         .finally(() => {
//           setLoading(false);
//           console.log("[Library] All books fetch process finished.");
//         });
//     } else if (TABS[activeTab] === "Wishlist" && isLoggedIn && authToken) {
//       // Fetch wishlist books for the 'Wishlist' tab
//       console.log("[Library] Fetching wishlist books from /likes");
//       setLoading(true);
//       setError(null);
//       api
//         .get("/likes", {
//           headers: { Authorization: `Bearer ${authToken}` },
//         })
//         .then((res) => {
//           console.log("[Library] API response for wishlist books:", res.data);
//           setWishlistBooks(res.data.data || []);
//         })
//         .catch((err) => {
//           console.error("[Library] Error fetching wishlist books:", err);
//           if (err.response) {
//             console.error("[Library] Error response data:", err.response.data);
//           }
//           setError(
//             err.response?.data?.message || "Failed to load wishlist books."
//           );
//         })
//         .finally(() => {
//           setLoading(false);
//           console.log("[Library] Wishlist books fetch process finished.");
//         });
//     } else {
//       if (TABS[activeTab] === "Finished Books") {
//         console.warn("[Library] Not fetching finished books: not logged in or missing auth token", {
//           isLoggedIn,
//           authTokenPresent: !!authToken,
//         });
//       }
//     }
//   }, [activeTab, isLoggedIn, authToken]);

//   const renderBooks = (booksToRender, isNestedBook = false) => (
//     <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//       {booksToRender.map((item, index) => {
//         // If rendering finished books, extract book info from item.book
//         const book = isNestedBook ? item.book : item;
//         if (!book) return null;
//         return (
//           <Card key={book.id || index} className="relative">
//             <div className="absolute top-2 right-2 text-red-500">
//               <Heart size={18} fill="white" />
//             </div>
//             <div className="relative">
//               <img
//                 src={book.cover_image_url || book.cover || "/images/placeholder.png"}
//                 alt={book.title}
//                 className="w-full h-60 object-cover rounded-t-xl"
//               />
//               {book.isVideo && (
//                 <PlayCircle
//                   className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white bg-black/50 rounded-full"
//                   size={40}
//                 />
//               )}
//             </div>
//             <CardContent className="p-4">
//               <h2 className="text-sm font-semibold leading-tight">
//                 {book.title}
//               </h2>
//               <p className="text-xs text-gray-500 mb-2">By: {book.author || book.author_name}</p>
//               <div className="flex items-center gap-2">
//                 {[...Array(5)].map((_, i) => (
//                   <span key={i} className="text-red-500">★</span>
//                 ))}
//               </div>
//               {book.price && (
//                 <div className="mt-3">
//                   <div className="text-sm font-semibold text-red-600 mb-1">
//                     ${book.price}
//                   </div>
//                   <Button
//                     onClick={() => <PdfFlipbook pdfUrl="/CYBERSECURITY.pdf" />}
//                     className="w-full bg-[#E50913]"
//                   >
//                     Read Book
//                   </Button>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         );
//       })}
//     </div>
//   );

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6">Library</h1>
//       <div className="flex gap-4 mb-6">
//         {TABS.map((tab, i) => (
//           <button
//             key={i}
//             className={`px-4 py-2 rounded-md shadow ${
//               i === activeTab ? "bg-red-600 text-white" : "bg-white text-black"
//             }`}
//             onClick={() => setActiveTab(i)}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>
//       {TABS[activeTab] === "Finished Books" ? (
//         loading ? (
//           <div>Loading finished books...</div>
//         ) : error ? (
//           <div className="text-red-600">{error}</div>
//         ) : finishedBooks.length === 0 ? (
//           <div>No finished books found.</div>
//         ) : (
//           renderBooks(finishedBooks, true)
//         )
//       ) : TABS[activeTab] === "All" ? (
//         loading ? (
//           <div>Loading books...</div>
//         ) : error ? (
//           <div className="text-red-600">{error}</div>
//         ) : allBooks.length === 0 ? (
//           <div>No books found.</div>
//         ) : (
//           renderBooks(allBooks)
//         )
//       ) : TABS[activeTab] === "Wishlist" ? (
//         loading ? (
//           <div>Loading wishlist books...</div>
//         ) : error ? (
//           <div className="text-red-600">{error}</div>
//         ) : wishlistBooks.length === 0 ? (
//           <div>No wishlist books found.</div>
//         ) : (
//           renderBooks(wishlistBooks, true)
//         )
//       ) : (
//         renderBooks(books)
//       )}
//     </div>
//   );
// }











































































































// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import dynamic from "next/dynamic";
// import { useAuth } from "@/contexts/AuthContext";
// import { api } from "@/utils/auth/readerApi";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Heart, PlayCircle } from "lucide-react";

// const PdfFlipbook = dynamic(() => import("@/components/PdfFlipbook"), {
//   ssr: false,
//   loading: () => <p>Loading flipbook viewer...</p>,
// });

// const TABS = ["All", "Wishlist", "Ebook", "Audiobooks", "Finished Books"];

// export default function Library() {
//   const router = useRouter();
//   const { authToken, isLoggedIn } = useAuth();
//   const [activeTab, setActiveTab] = useState(0);
//   const [finishedBooks, setFinishedBooks] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [allBooks, setAllBooks] = useState([]);
//   const [wishlistBooks, setWishlistBooks] = useState([]);

//   // Placeholder for other tabs
// const books = [
//   {
//     title: "Rise of the Jumbies",
//     author: "Tracey Baptiste",
//     cover: "/images/books/book4.png",
//     price: 27,
//     isVideo: false,
//   },
//   {
//     title: "Glory",
//     author: "NoViolet Bulawayo",
//     cover: "/images/books/book4.png",
//     price: 27,
//     isVideo: false,
//   },
//   {
//     title: "You made a Fool...",
//     author: "Akwaeke Emezi",
//     cover: "/images/books/book4.png",
//     price: 27,
//     isVideo: true,
//   },
//   {
//     title: "Gaslight",
//     author: "Femi Kayode",
//     cover: "/images/books/book4.png",
//     price: 25,
//     isVideo: false,
//   },
//   {
//     title: "Death of the Author",
//     author: "Nnedi Okorafor",
//     cover: "/images/books/book4.png",
//     price: 27,
//     isVideo: false,
//   },
//   {
//     title: "The Lazarus Effect",
//     author: "H.J. Golakai",
//     cover: "/images/books/book4.png",
//     price: 27,
//     isVideo: false,
//   },
//   {
//     title: "In Bed With Her Guy",
//     author: "Yinka Akiran",
//     cover: "/images/books/book4.png",
//     price: 20,
//     isVideo: false,
//   },
//   {
//     title: "Really good, actually",
//     author: "Monica Heisey",
//     cover: "/images/books/book4.png",
//     price: 27,
//     isVideo: true,
//   },
// ];

//   useEffect(() => {
//     if (TABS[activeTab] === "Finished Books" && isLoggedIn && authToken) {
//       console.log("[Library] Fetching finished books from API", {
//         activeTab: TABS[activeTab],
//         isLoggedIn,
//         authTokenPresent: !!authToken,
//       });
//       setLoading(true);
//       setError(null);
//       api
//         .get("/reader/finished_books", {
//           headers: { Authorization: `Bearer ${authToken}` },
//         })
//         .then((res) => {
//           console.log("[Library] API response for finished books:", res);
//           setFinishedBooks(res.data.data || []);
//         })
//         .catch((err) => {
//           console.error("[Library] Error fetching finished books:", err);
//           if (err.response) {
//             console.error("[Library] Error response data:", err.response.data);
//           }
//           setError(
//             err.response?.data?.message || "Failed to load finished books."
//           );
//         })
//         .finally(() => {
//           setLoading(false);
//           console.log("[Library] Finished books fetch process finished.");
//         });
//     } else if (TABS[activeTab] === "All") {
//       // Fetch all books for the 'All' tab
//       console.log("[Library] Fetching all books from /api/v1/books");
//       // console.log("[Library] Fetching all books from /purchases");
//       setLoading(true);
//       setError(null);
//       api
//         .get("/purchases")
//         // .get("/books/my_books")
//         .then((res) => {
//           console.log("[Library] API response for all books:", res);
//           setAllBooks(res.data.data || []);
//         })
//         .catch((err) => {
//           console.error("[Library] Error fetching all books:", err);
//           if (err.response) {
//             console.error("[Library] Error response data:", err.response.data);
//           }
//           setError(
//             err.response?.data?.message || "Failed to load books."
//           );
//         })
//         .finally(() => {
//           setLoading(false);
//           console.log("[Library] All books fetch process finished.");
//         });
//     } else if (TABS[activeTab] === "Wishlist" && isLoggedIn && authToken) {
//       // Fetch wishlist books for the 'Wishlist' tab
//       console.log("[Library] Fetching wishlist books from /likes");
//       setLoading(true);
//       setError(null);
//       api
//         .get("/likes", {
//           headers: { Authorization: `Bearer ${authToken}` },
//         })
//         .then((res) => {
//           console.log("[Library] API response for wishlist books:", res.data);
//           setWishlistBooks(res.data.data || []);
//         })
//         .catch((err) => {
//           console.error("[Library] Error fetching wishlist books:", err);
//           if (err.response) {
//             console.error("[Library] Error response data:", err.response.data);
//           }
//           setError(
//             err.response?.data?.message || "Failed to load wishlist books."
//           );
//         })
//         .finally(() => {
//           setLoading(false);
//           console.log("[Library] Wishlist books fetch process finished.");
//         });
//     } else {
//       if (TABS[activeTab] === "Finished Books") {
//         console.warn("[Library] Not fetching finished books: not logged in or missing auth token", {
//           isLoggedIn,
//           authTokenPresent: !!authToken,
//         });
//       }
//     }
//   }, [activeTab, isLoggedIn, authToken]);

//   const renderBooks = (booksToRender, isNestedBook = false) => (
//     <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
//       {booksToRender.map((item, index) => {
//         const book = isNestedBook ? item.book : item;
//         if (!book) return null;
//         return (
//           <Card
//             key={book.id || index}
//             className="w-full bg-white p-2 rounded relative shadow-md"
//           >
//             {/* Like Button */}
//             <div className="absolute top-2 right-2 z-10">
//               <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center shadow">
//                 <Heart size={16} className="text-red-500" fill="white" />
//               </div>
//             </div>

//             {/* Book Image */}
//             <div className="w-full h-[220px] lg:h-[260px] relative rounded overflow-hidden mb-2">
//               <img
//                 src={book.cover_image_url || book.cover || "/images/placeholder.png"}
//                 alt={book.title}
//                 className="w-full h-full object-cover rounded"
//               />
//               {book.isVideo && (
//                 <PlayCircle
//                   className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white bg-black/40 rounded-full"
//                   size={40}
//                 />
//               )}
//             </div>

//             {/* Stars */}
//             <div className="flex items-center gap-0.5 mb-1">
//               {[...Array(5)].map((_, i) => (
//                 <span key={i} className="text-red-500 text-xs">★</span>
//               ))}
//             </div>

//             {/* Title & Author */}
//             <p className="text-sm font-bold leading-snug truncate">{book.title}</p>
//             <p className="text-xs text-gray-500 mb-2 truncate">
//               By: {book.author || book.author_name || "Unknown"}
//             </p>

//             {/* Read Button */}
//             <Button
//               onClick={() => <PdfFlipbook pdfUrl="/CYBERSECURITY.pdf" />}
//               className="w-full bg-red-600 text-white text-xs font-medium px-2 py-1 rounded-full hover:bg-red-700 transition-colors"
//             >
//               Read Book
//             </Button>
//           </Card>
//         );
//       })}
//     </div>
//   );


//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6">Library</h1>
//       <div className="flex gap-4 mb-6">
//         <div className="flex flex-wrap items-center justify-between mb-6">
//           <div className="flex gap-3 flex-wrap">
//             {TABS.map((tab, i) => (
//               <button
//                 key={i}
//                 className={`px-4 py-1.5 border text-sm rounded-full transition-colors duration-150 ${i === activeTab
//                     ? "bg-red-600 text-white border-red-600"
//                     : "bg-white text-gray-700 border-gray-300 hover:border-red-400"
//                   }`}
//                 onClick={() => setActiveTab(i)}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>
//           <div className="mt-3 sm:mt-0">
//             <select className="border border-red-600 text-red-600 px-3 py-1.5 rounded-md text-sm bg-white focus:outline-none">
//               <option>Browse Categories</option>
//             </select>
//           </div>
//         </div>

//       </div>
//       {TABS[activeTab] === "Finished Books" ? (
//         loading ? (
//           <div>Loading finished books...</div>
//         ) : error ? (
//           <div className="text-red-600">{error}</div>
//         ) : finishedBooks.length === 0 ? (
//           <div>No finished books found.</div>
//         ) : (
//           renderBooks(finishedBooks, true)
//         )
//       ) : TABS[activeTab] === "All" ? (
//         loading ? (
//           <div>Loading books...</div>
//         ) : error ? (
//           <div className="text-red-600">{error}</div>
//         ) : allBooks.length === 0 ? (
//           <div>No books found.</div>
//         ) : (
//           renderBooks(allBooks)
//         )
//       ) : TABS[activeTab] === "Wishlist" ? (
//         loading ? (
//           <div>Loading wishlist books...</div>
//         ) : error ? (
//           <div className="text-red-600">{error}</div>
//         ) : wishlistBooks.length === 0 ? (
//           <div>No wishlist books found.</div>
//         ) : (
//           renderBooks(wishlistBooks, true)
//         )
//       ) : (
//         renderBooks(books)
//       )}
//     </div>
//   );
// }
























"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/utils/auth/readerApi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, PlayCircle } from "lucide-react";
import LikeButton from "@/components/LikeButton";
import Link from "next/link";
import Image from "next/image";

const PdfFlipbook = dynamic(() => import("@/components/PdfFlipbook"), {
  ssr: false,
  loading: () => <p>Loading reader...</p>,
});




export default function Library() {
  const router = useRouter();
  const { authToken, isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [finishedBooks, setFinishedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allBooks, setAllBooks] = useState([]);
  const [wishlistBooks, setWishlistBooks] = useState([]);
  const [currentReads, setCurrentReads] = useState([]);
  const [audioBooks, setAudioBooks] = useState([]);


  const TABS = ["Bought Books", "Current Reads", "Finished Books", "My Wishlist", "Audiobooks"];

  const books = [
    {
      id: 1,
      title: "Rise of the Jumbies",
      author: "Tracey Baptiste",
      cover: "/images/books/book4.png",
      price: 27,
      isVideo: false,
    },
    {
      id: 2,
      title: "Glory",
      author: "NoViolet Bulawayo",
      cover: "/images/books/book4.png",
      price: 27,
      isVideo: false,
    },
    {
      id: 3,
      title: "You made a Fool...",
      author: "Akwaeke Emezi",
      cover: "/images/books/book4.png",
      price: 27,
      isVideo: true,
    },
    {
      id: 4,
      title: "Gaslight",
      author: "Femi Kayode",
      cover: "/images/books/book4.png",
      price: 25,
      isVideo: false,
    },
    {
      id: 5,
      title: "Death of the Author",
      author: "Nnedi Okorafor",
      cover: "/images/books/book4.png",
      price: 27,
      isVideo: false,
    },
    {
      id: 6,
      title: "The Lazarus Effect",
      author: "H.J. Golakai",
      cover: "/images/books/book4.png",
      price: 27,
      isVideo: false,
    },
    {
      id: 7,
      title: "In Bed With Her Guy",
      author: "Yinka Akiran",
      cover: "/images/books/book4.png",
      price: 20,
      isVideo: false,
    },
    {
      id: 8,
      title: "Really good, actually",
      author: "Monica Heisey",
      cover: "/images/books/book4.png",
      price: 27,
      isVideo: true,
    },

    {
      id: 9,
      title: "The Art of War",
      author: "Sun Tzu",
      cover: "/images/books/book4.png",
      price: 15,
      isVideo: false,
    },
    {
      id: 10,
      title: "1984",
      author: "George Orwell",
      cover: "/images/books/book4.png",
      price: 20,
      isVideo: false,
    },
    {
      id: 11,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      cover: "/images/books/book4.png",
      price: 18,
      isVideo: false,
    },
    {
      id: 12,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      cover: "/images/books/book4.png",
      price: 22,
      isVideo: false,
    },
  ];

  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchBooks = async () => {
      try {
        if (TABS[activeTab] === "Finished Books" && isLoggedIn && authToken) {
          // const res = await api.get("/reader/finished_books", {
          //   headers: { Authorization: `Bearer ${authToken}` },
          // });
          // setFinishedBooks(res.data.data || []);
          setFinishedBooks(books.slice(0, 8)); // Simulating finished books
          console.log("SEE FINISHED BOOKS", finishedBooks)
        } else if (TABS[activeTab] === "Bought Books") {
          // const res = await api.get("/books");
          // setAllBooks(res.data.data || []);
          setAllBooks(books)
        } else if (TABS[activeTab] === "My Wishlist" && isLoggedIn && authToken) {
          // const res = await api.get("/likes", {
          //   headers: { Authorization: `Bearer ${authToken}` },
          // });
          // setWishlistBooks(res.data.data || []);
          setWishlistBooks(books.slice(0, 10));
        } else if (TABS[activeTab] === "Current Reads" && isLoggedIn && authToken) {
          setCurrentReads(books.slice(0, 5));
          console.log("[Library] Current reads:", currentReads);
        } else if (TABS[activeTab] === "Audiobooks" && isLoggedIn && authToken) {
          setAudioBooks(" ");
          console.log("[Library] Current reads:", currentReads);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load books.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [activeTab, isLoggedIn, authToken]);


  // const renderBooks = (booksToRender, isNestedBook = false) => (
  //   <div className="max-w-[1440px] mx-auto px-4">
  //     <div
  //       className={`
  //       grid gap-4
  //       grid-cols-2
  //       sm:grid-cols-3
  //       md:grid-cols-4
  //       lg:grid-cols-5
  //       xl:grid-cols-6
  //       2xl:grid-cols-7
  //       mt-14
  //     `}
  //     >
  //       {booksToRender.map((item, index) => {
  //         const book = isNestedBook ? item.book : item;
  //         if (!book) return null;

  //         // console.log("Rendering Book in renderBooks:", booksToRender);

  //         return (
  //           <div
  //             key={index}
  //             className="relative bg-white p-2 rounded shadow-md w-full"
  //           >

  //             <div className="absolute top-1 right-1 z-10 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow">
  //               <div className="bg-white rounded-full w-4 h-4 flex items-center justify-center text-red-500">
  //                 <Heart />
  //               </div>
  //             </div>

  //             <div className="w-full h-[220px] relative rounded overflow-hidden mb-2">
  //               <Image
  //                 src={book.image || `https://picsum.photos/150/220?random=${index + 20}`}
  //                 alt={book.title || "Book Title"}
  //                 fill
  //                 className="object-cover rounded"
  //               />
  //             </div>

  //             <div className="flex items-center gap-0.5 mb-1">
  //               {Array.from({ length: 5 }).map((_, i) => (
  //                 <span key={i} className="text-red-500 text-xs">★</span>
  //               ))}
  //             </div>

  //             <p className="text-sm font-bold leading-snug">{book.title}</p>
  //             <p className="text-xs text-gray-500 mb-1">
  //               By: {book?.author?.trim() ? book.author : "Jane Doe"}
  //             </p>

  //             <div className="flex justify-between items-center mt-1">
  //               <span className="text-teal-600 font-bold text-[16px]">
  //                 ${Number(book.price) / 100}
  //               </span>
  //               <Link
  //                 href={`/reader/home/book-details/${book.id}`}
  //                 className="bg-red-600 text-white text-xs font-medium px-2 py-1 rounded-full hover:bg-red-700 transition-colors"
  //               >
  //                 View details
  //               </Link>
  //             </div>
  //           </div>
  //         );
  //       })}
  //     </div>
  //   </div>
  // );




  const renderBoughtBooks = (booksToRender, isNestedBook = false) => {
    return (
      <div className="max-w-[1440px] mx-auto px-4 mt-14">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-6">
          {booksToRender.map((item, index) => {
            const book = isNestedBook ? item.book : item;
            if (!book) return null;

            return (
              <div
                key={index}
                // className="w-[170px] sm:w-[160px] lg:w-[180px] bg-white p-2 rounded relative flex-shrink-0 shadow-md"
                className="relative bg-white p-2 rounded shadow-md flex-shrink-0 w-[150px] sm:w-[160px] md:w-[180px] scrollSnap-align-start"


              >
                {/* Heart */}
                <div className="absolute top-1 right-1 z-10 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow">
                  <div className="bg-white rounded-full w-4 h-4 flex items-center justify-center text-red-500">
                    <Heart />
                  </div>
                </div>

                {/* Book Image */}
                <div className="w-full h-[220px] md:h-[260px] relative rounded overflow-hidden mb-2">
                  <Image
                    src={book.image || `https://picsum.photos/150/220?random=${index + 20}`}
                    alt={book.title || "Book Title"}
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

                {/* Title or CTA */}
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
            );
          })}
        </div>
      </div>
    );
  };




  const renderFinishedBooks = (booksToRender, isNestedBook = false) => {
    return (
      <div className="max-w-[1440px] mx-auto px-4 mt-14">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-6">
          {booksToRender.map((item, index) => {
            const book = isNestedBook ? item.book : item;
            if (!book) return null;

            return (
              <div
                key={index}
                // className="w-[170px] sm:w-[160px] lg:w-[180px] bg-white p-2 rounded relative flex-shrink-0 shadow-md"
                className="relative bg-white p-2 rounded shadow-md flex-shrink-0 w-[150px] sm:w-[160px] md:w-[180px] scrollSnap-align-start"

              >
                {/* Book Image */}
                <div className="w-full h-[220px] md:h-[260px] relative rounded overflow-hidden mb-2">
                  <Image
                    src={book.image || `https://picsum.photos/150/220?random=${index + 20}`}
                    alt={book.title || "Book Title"}
                    fill
                    className="object-cover rounded"
                  />
                </div>

                {/* Title or CTA */}
                <p className="text-sm font-bold leading-snug">{book.title}</p>
                <p className="text-xs text-gray-500 mb-1">
                  By: {book?.author?.trim() ? book.author : "Jane Doe"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };






  const renderCurrentReads = (booksToRender, isNestedBook = false) => {
    return (
      <div className="max-w-[1440px] mx-auto px-4 mt-14">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-6">
          {booksToRender.map((item, index) => {
            const book = isNestedBook ? item.book : item;
            if (!book) return null;

            return (
              <div
                key={index}
                // className="w-[170px] sm:w-[160px] lg:w-[180px] bg-white p-2 rounded relative flex-shrink-0 shadow-md"
                className="relative bg-white p-2 rounded shadow-md flex-shrink-0 w-[150px] sm:w-[160px] md:w-[180px] scrollSnap-align-start"


              >
                {/* Book Image */}
                <div className="w-full h-[220px] lg:h-[260px] relative rounded overflow-hidden mb-2">
                  <Image
                    src={book.image || `https://picsum.photos/150/220?random=${index + 20}`}
                    alt={book.title || "Book Title"}
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
            );
          })}
        </div>
      </div>
    );
  };




  const renderAudioBooks = (booksToRender, isNestedBook = false) => {
    if (!Array.isArray(booksToRender) || booksToRender.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-700">
            Your Audio Book library is currently empty.
          </h2>
          <p className="text-md md:text-lg text-gray-500 max-w-md">
            Explore the store to add books and audio books to your library.
          </p>
        </div>
      );
    }
    return (
      <div className="max-w-[1440px] mx-auto px-4 mt-14">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-6">
          {booksToRender.map((item, index) => {
            const book = isNestedBook ? item.book : item;
            if (!book) return null;

            return (
              <div
                key={index}
                // className="w-[170px] sm:w-[160px] lg:w-[180px] bg-white p-2 rounded relative flex-shrink-0 shadow-md"
                className="relative bg-white p-2 rounded shadow-md flex-shrink-0 w-[150px] sm:w-[160px] md:w-[180px] scrollSnap-align-start"


              >
                {/* Book Image */}
                <div className="w-full h-[220px] lg:h-[260px] relative rounded overflow-hidden mb-2">
                  <Image
                    src={book.image || `https://picsum.photos/150/220?random=${index + 20}`}
                    alt={book.title || "Book Title"}
                    fill
                    className="object-cover rounded"
                  />
                </div>

                {/* Page and continue Button */}
                <div className="flex flex-col justify-center items-center mt-1">
                  <p className="text-xs text-gray-600 mb-1">Page 25 of 283</p>

                  <Button className="bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-7 py-1 rounded">
                    Play Audio
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };



  return (
    <div className="p-6">
      {/* Header row with title and select */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Library</h1>
        <select
          className="w-[259px] h-[52px] border-[3px] border-[#E50913] text-gray-800 px-[10px] rounded-[8px] text-sm bg-white focus:outline-none"
        >
          <option>Browse Categories</option>
        </select>
      </div>

      {/* Tab buttons */}
      <div className="mb-6">
        <div className="w-full max-w-screen-xl px-4 mx-auto flex flex-wrap gap-6 items-center justify-center">
          {TABS.map((tab, i) => (
            <button
              key={i}
              className={`w-[160px] h-[82px] text-sm rounded-[12px] border transition-colors duration-150
          ${i === activeTab
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-red-400"}`}
              style={{
                boxShadow: `10px 10px 20px -1px #00000026, -10px -10px 20px 1px #F2F9FF4D`,
              }}
              onClick={() => setActiveTab(i)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Book rendering */}
      {loading ? (
        <div>Loading books...</div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center text-center mt-20 px-4">
          {/* Optional error icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-red-500 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" />
          </svg>

          <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-red-600">
            Oops! Something went wrong.
          </h2>

          <p className="text-sm md:text-base text-gray-600 max-w-md mb-4">
            {error || "We couldn’t load your library at the moment. Please try again later."}
          </p>

          <button
            // onClick={handleRetry} 
            className="mt-2 px-5 py-2 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      ) : (activeTab === 0 && allBooks.length === 0) ||
        (activeTab === 1 && currentReads.length === 0) ||
        (activeTab === 2 && finishedBooks.length === 0) ||
        (books.length === 0) ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-700">
            Your library is currently empty.
          </h2>
          <p className="text-md md:text-lg text-gray-500 max-w-md">
            Explore the store to add books and audio books to your library.
          </p>
        </div>
      ) : activeTab === 0 ? (
        renderBoughtBooks(allBooks)
      ) : activeTab === 1 ? (
        renderCurrentReads(currentReads)
      ) : activeTab === 2 ? (
        renderFinishedBooks(finishedBooks)
      ) : activeTab === 4 ? (
        renderAudioBooks(audioBooks)
      ) : (
        renderBoughtBooks(books)
      )}
    </div>
  )
}


