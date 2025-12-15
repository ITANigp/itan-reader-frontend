// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Image from "next/image";
// import Link from "next/link";
// import { FaRegStar } from "react-icons/fa"; // Import a star icon if needed

// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";

// import BuyButton from "@/components/reader/BuyButton";
// import ReviewForm from "@/components/ReviewForm";
// import ReviewCard from "@/components/ReviewCard";
// import chunkText from "@/utils/chunkText";
// import { api } from "@/utils/auth/readerApi";
// import axios from "axios";

// import { useAuth } from "@/contexts/AuthContext";

// export default function BookDetails() {
//   const { isLoggedIn, userId: currentUserId, authToken } = useAuth();
//   const params = useParams();
//   const router = useRouter();
//   const bookId = params.id;

//   const [bookData, setBookData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

//   const [isTrialActive, setIsTrialActive] = useState(false);
//   const [daysLeftInTrial, setDaysLeftInTrial] = useState(0);

//   // Real trial logic: fetch trial dates from user profile
//   useEffect(() => {
//     async function fetchTrialInfo() {
//       if (!isLoggedIn || !authToken) return;
//       try {
//         // Try common profile endpoints
//         let response;
//         try {
//           response = await api.get("/readers/profile", {
//             headers: { Authorization: `Bearer ${authToken}` },
//           });
//         } catch (err) {
//           // Fallback to /profile/me if /readers/profile fails
//           response = await api.get("/profile/me", {
//             headers: { Authorization: `Bearer ${authToken}` },
//           });
//         }
//         const { trial_start, trial_end } = response.data.data || {};
//         if (trial_start && trial_end) {
//           const now = new Date();
//           const start = new Date(trial_start);
//           const end = new Date(trial_end);
//           let daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
//           if (daysLeft < 0) daysLeft = 0;
//           setIsTrialActive(daysLeft > 0);
//           setDaysLeftInTrial(daysLeft);
//           // setIsTrialActive(false);
//           // setDaysLeftInTrial(0);
//         } else {
//           setIsTrialActive(false);
//           setDaysLeftInTrial(0);
//         }
//       } catch (err) {
//         setIsTrialActive(false);
//         setDaysLeftInTrial(0);
//       }
//     }
//     fetchTrialInfo();
//   }, [isLoggedIn, authToken]);

//   useEffect(() => {
//     if (!bookId) return;

//     const fetchBookDetails = async () => {
//       try {
//         setLoading(true);
//         const response = await api.get(`/books/${bookId}/storefront`);
//         setBookData({
//           ...response.data.data.attributes,
//           unique_book_id: response.data.data.id,
//         });
//       } catch (err) {
//         if (axios.isAxiosError(err)) {
//           if (err.response?.status === 404) {
//             setError("Book not found.");
//           } else {
//             setError(err.response?.data?.message || "Failed to fetch book.");
//           }
//         } else {
//           setError("Unexpected error occurred.");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookDetails();
//   }, [bookId]);

//   // 📚 Reusable Read Logic (Inspired by Library.js)
//   const startReading = useCallback(
//     async (bookData, bookId) => {
//       try {
//         // 1. Refresh reading token
//         const tokenRes = await api.post(
//           "/purchases/refresh_reading_token",
//           {
//             book_id: bookId,
//             content_type: "ebook",
//           },
//           { headers: { Authorization: `Bearer ${authToken}` } }
//         );

//         const reading_token =
//           tokenRes.data?.reading_token || tokenRes.data?.data?.reading_token;

//         if (!reading_token) throw new Error("No reading token received");

//         // 2. Get book content
//         const contentRes = await api.get(
//           `/books/${bookId}/content?direct_url=true&optimize_for_frontend=true`,
//           { headers: { Authorization: `Bearer ${reading_token}` } }
//         );

//         const content = contentRes.data;
//         const fileUrl = content?.s3_url || content?.url;
//         const format = content?.format || "unknown";

//         if (fileUrl) {
//           // 3. Navigate to flipbook with url + title + bookId
//           const urlParams = new URLSearchParams();
//           urlParams.set("url", fileUrl);
//           urlParams.set("title", bookData.title);
//           urlParams.set("bookId", bookId);
//           urlParams.set("format", format); // Add format for better client-side handling

//           router.push(`/reader/flipbook?${urlParams.toString()}`);
//         } else {
//           throw new Error("Book content URL unavailable.");
//         }
//       } catch (err) {
//         console.error("Read error:", err);
//         alert("Unable to read book. Please try again. " + err.message);
//       }
//     },
//     [authToken, router]
//   );

//   const handleReadNow = useCallback(async () => {
//     if (!bookData) return;

//     if (!isLoggedIn || !authToken || !currentUserId) {
//       router.push("/reader/sign_up");
//       return;
//     }

//     if (isTrialActive) {
//       // ✅ Use the reusable logic for trial reading
//       await startReading(bookData, bookData.unique_book_id);
//     } else {
//       // Fallback for non-trial/post-purchase (use old logic or alert)
//       alert("Trial ended. Please purchase the book to continue reading.");
//     }
//   }, [
//     bookData,
//     isLoggedIn,
//     authToken,
//     currentUserId,
//     isTrialActive,
//     router,
//     startReading,
//   ]);

//   const handleReviewCreated = useCallback(
//     (newReview) => {
//       // console.log("New review received in page component:", newReview);

//       // The review should already be properly formatted by createReview function
//       // But we'll do a final check to ensure everything is correct
//       const processedReview = {
//         ...newReview,
//         // Make sure we have an ID
//         id: newReview.id || `temp-${Date.now()}`,
//         // Make sure we have complete reader info
//         reader: {
//           ...(newReview.reader || {}),
//           id: newReview.reader?.id || currentUserId,
//           name: newReview.reader?.name || "You",
//         },
//       };

//       // console.log("Final review object being added to UI:", processedReview);

//       // Update the book data state with the new review
//       setBookData((prev) => {
//         const updatedData = {
//           ...prev,
//           reviews: [...(prev.reviews || []), processedReview],
//           reviews_count: (prev.reviews_count || 0) + 1,
//         };
//         // console.log("Updated book data with new review:", updatedData.reviews);
//         return updatedData;
//       });

//       // Close the review modal
//       setIsReviewModalOpen(false);
//     },
//     [currentUserId]
//   );

//   const handleReviewDeleted = useCallback((deletedId) => {
//     setBookData((prev) => ({
//       ...prev,
//       reviews: (prev.reviews || []).filter((r) => r.id !== deletedId),
//       reviews_count: (prev.reviews_count || 1) - 1,
//     }));
//   }, []);

//   if (loading) return <div className="text-center py-20">Loading...</div>;
//   if (error)
//     return <div className="text-center text-red-500 py-20">{error}</div>;
//   if (!bookData) return <div className="text-center py-20">No data.</div>;

//   const {
//     title,
//     description,
//     ebook_price,
//     cover_image_url,
//     total_pages,
//     categories,
//     author,
//     average_rating,
//     ebook_file_size_human,
//     reviews,
//     reviews_count,
//     unique_book_id,
//     created_at,
//   } = bookData;

//   const authorName = author?.name || "Unknown";
//   const displayPrice = ebook_price ? `$${ebook_price.toFixed(2)}` : "N/A";
//   const displayGenre = categories?.[0]?.main || "N/A";
//   const displayDate = created_at
//     ? new Date(created_at).toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//       })
//     : "N/A";

//   const displayRating =
//     average_rating > 0
//       ? "★".repeat(Math.round(average_rating)) +
//         "☆".repeat(5 - Math.round(average_rating))
//       : "No ratings yet";

//   return (
//     <div className="space-y-10 px-6 py-10">
//       <Link href="/home" className="text-blue-600 hover:underline">
//         ← Back to home
//       </Link>

//       <div className="flex flex-col md:flex-row gap-6">
//         <Image
//           src={cover_image_url || "/images/placeholder.png"}
//           alt={title}
//           width={150}
//           height={220}
//           className="rounded object-cover"
//         />
//         <div className="flex-1 space-y-2">
//           <h2 className="text-2xl font-semibold">{title}</h2>
//           <p className="text-gray-700">{authorName}</p>
//           <div className="text-red-600 text-lg">
//             {displayRating} ({reviews_count || 0} Ratings)
//           </div>

//           <div className="flex flex-wrap gap-4 mt-4">
//             {isLoggedIn && isTrialActive ? (
//               <Button onClick={handleReadNow}> Read Now (Trial)</Button>
//             ) : null}

//             <BuyButton
//               bookId={unique_book_id}
//               className="bg-green-600 text-white rounded-md px-2"
//             >
//               {isLoggedIn && !isTrialActive
//                 ? "Buy Now"
//                 : `Buy eBook (${displayPrice})`}
//             </BuyButton>

//             <Button variant="outline">Add to Wishlist</Button>

//             <Dialog
//               open={isReviewModalOpen}
//               onOpenChange={setIsReviewModalOpen}
//             >
//               <DialogTrigger asChild>
//                 <Button variant="ghost" className="border">
//                   Write a Review
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="sm:max-w-[425px]">
//                 <DialogHeader>
//                   <DialogTitle>Write a Review for "{title}"</DialogTitle>
//                 </DialogHeader>
//                 <ReviewForm
//                   bookId={unique_book_id}
//                   onReviewCreated={handleReviewCreated}
//                   token={authToken}
//                   userId={currentUserId}
//                 />
//               </DialogContent>
//             </Dialog>
//           </div>
//         </div>
//       </div>

//       {isLoggedIn && isTrialActive && (
//         <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg text-center font-medium">
//           🌟 You have {daysLeftInTrial} days left in your free trial! Read any
//           book!
//         </div>
//       )}
//       <section>
//         <h3 className="text-xl font-semibold mb-2">Book’s Description</h3>
//         <div className="text-gray-700 leading-relaxed space-y-4">
//           {description
//             ? chunkText(description, 300).map((para, idx) => (
//                 <p key={idx}>{para}</p>
//               ))
//             : "No description available."}
//         </div>
//       </section>

//       <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center border-t border-b py-4">
//         <div>
//           <strong>GENRE</strong>
//           <p>{displayGenre}</p>
//         </div>
//         <div>
//           <strong>PUBLICATION DATE</strong>
//           <p>{displayDate}</p>
//         </div>
//         <div>
//           <strong>LANGUAGE</strong>
//           <p>English</p>
//         </div>
//         <div>
//           <strong>LENGTH</strong>
//           <p>{total_pages} Pages</p>
//         </div>
//         <div>
//           <strong>SIZE</strong>
//           <p>{ebook_file_size_human}</p>
//         </div>
//       </div>

//       <section>
//         <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
//         {reviews?.length > 0 ? (
//           <div className="flex gap-4 overflow-x-auto">
//             {reviews.map((review, index) => (
//               <ReviewCard
//                 key={review.id || `review-${index}`}
//                 review={review}
//                 currentUserIsOwner={
//                   review.reader?.id === currentUserId ||
//                   review.user_id === currentUserId
//                 }
//                 onDeleteSuccess={handleReviewDeleted}
//                 token={authToken}
//               />
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-600">No reviews yet. Be the first!</p>
//         )}
//       </section>
//     </div>
//   );
// }

import BookDetailsClient from "./BookDetailsClient";

export async function generateMetadata({ params }) {
  const { id } = params;

  const apiUrl = "https://api.itan.app/api/v1"
  // if (!apiUrl) {
  //   console.error("❌ Missing API_URL(1) in server environment");
  //   return {};
  // }

  const res = await fetch(`${apiUrl}/books/${id}/storefront`);
  const { data } = await res.json();

  const book = data.attributes;

  return {
    title: `${book.title} — ${book.author?.name}`,
    description: book.description?.slice(0, 160),
    openGraph: {
      title: book.title,
      description: book.description?.slice(0, 160),
      images: [book.cover_image_url],
      type: "book",
    },
    robots: { index: true, follow: true },
  };
}

export default async function BookDetailsPage({ params }) {
  const { id } = params;

  const apiUrl = "https://api.itan.app/api/v1"
  // if (!apiUrl) {
  //   console.error("❌ Missing API_URL(2) in server environment");
  //   return <div>Error: Server API URL missing</div>;
  // }

  const res = await fetch(`${apiUrl}/books/${id}/storefront`, {
    cache: "no-cache",
  });

  const { data } = await res.json();

  const book = {
    ...data.attributes,
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
            author: book.author?.name,
            image: book.cover_image_url,
            description: book.description,
            genre: book.categories?.[0]?.main || "",
            offers: {
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
}
