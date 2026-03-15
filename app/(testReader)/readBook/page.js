"use client";

import dynamic from "next/dynamic";

const BookReader = dynamic(() => import("@/components/bookReader"), {
  ssr: false,
});

const pages = [
  "Welcome to your textbook. This is page one content.",
  "Chapter One: The fundamentals of reading experience.",
  "You're doing great! Just one more page to finish.",
  "Welcome to your textbook. This is page one content.",
  "Chapter One: The fundamentals of reading experience.",
  "You're doing great! Just one more page to finish.",
];

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <BookReader pages={pages} />
    </div>
  );
}
