"use client";

import dynamic from 'next/dynamic';

const PdfFlipbook = dynamic(() => import('@/components/PdfFlipbook'), {
  ssr: false,
  loading: () => <p>Loading flipbook...</p>,
});

export default function ReadBook3Page() {
  const pdfUrl = "/CYBERSECURITY.pdf";

  return (
    <div>
      <h1>Read Book 3</h1>
      <PdfFlipbook pdfUrl={pdfUrl} />
    </div>
  );
}

