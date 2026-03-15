"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

export default function PDFBookWithUI({ pdfUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(1.0);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const nextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  const prevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="mb-4">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading="Loading PDF..."
        >
          <Page
            pageNumber={pageNumber}
            scale={zoom}
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>
      </div>

      <div className="flex items-center gap-4 mt-4">
        <button onClick={prevPage} className="bg-gray-700 px-3 py-1 rounded">
          Prev
        </button>
        <span>
          Page {pageNumber} / {numPages}
        </span>
        <button onClick={nextPage} className="bg-gray-700 px-3 py-1 rounded">
          Next
        </button>

        <button
          onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
          className="bg-gray-700 px-2 py-1 rounded"
        >
          -
        </button>
        <span>{Math.round(zoom * 100)}%</span>
        <button
          onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
          className="bg-gray-700 px-2 py-1 rounded"
        >
          +
        </button>
      </div>
    </div>
  );
}
