"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"; // Rails

export default function BookBySlugPage() {
  const params = useParams();
//   const slug = Array.isArray(params.slug) ? params.slug.join("/") : params.slug;
const slug = params.slug

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;

    fetch(`${API_BASE}/books/by-slug/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Book not found");
        return res.json();
      })
      .then((data) => setBook(data))
      .catch(() => setError("Book not found"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p>Loading book...</p>;
  if (error || !book) return <p>{error || "Book not found"}</p>;

  return (
    <div>
      <h1>{book.title}</h1>
      <p>By {book.first_name} {book.last_name}</p>
      {book.cover_image_url && <img src={book.cover_image_url} alt={book.title} />}
      <p>{book.description}</p>
    </div>
  );
}
