// app/components/PdfFlipbook.js
"use client";

import React, { useState, useRef, useCallback } from "react";
import { Document, Page as ReactPdfPage, pdfjs } from "react-pdf";
import HTMLFlipBook from "react-pageflip";

// Configure react-pdf worker
// This approach is generally more robust for Next.js and modern build systems.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

// Import react-pdf stylesheets for text layer and annotations
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// A functional component for individual pages within the flipbook.
// It needs to be forwardRef because HTMLFlipBook passes a ref to its children.
const Page = React.forwardRef(({ pageNumber, width, height }, ref) => {
  return (
    <div
      ref={ref}
      className="flex justify-center items-center bg-gray-100 border border-gray-300 shadow-md overflow-hidden relative" // Tailwind for styling the page container
    >
      <ReactPdfPage
        pageNumber={pageNumber}
        width={width}
        height={height}
        renderTextLayer={true} // Enable text selection
        renderAnnotationLayer={true} // Enable links/annotations
        className="w-full h-full" // Ensure PDF page takes full available space
      />
      {/* Optional: Page number overlay */}
      <p className="absolute bottom-2 right-4 text-gray-600 text-sm">
        Page {pageNumber}
      </p>
    </div>
  );
});

Page.displayName = "Page"; // Good practice for debugging with React DevTools

function PdfFlipbook({ pdfUrl }) {
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const bookRef = useRef(null);

  // Define base dimensions for the flipbook pages.
  // These will be used by react-pdf's Page component.
  // The HTMLFlipBook component handles the responsiveness based on its own min/max width/height.
  const basePageWidth = 500;
  const basePageHeight = 700;

  // Callback for when the PDF document successfully loads
  const onDocumentLoadSuccess = useCallback(({ numPages }) => {
    setNumPages(numPages);
    setCurrentPage(1); // Reset to first page on new document load
  }, []);

  // Callback for when the flipbook page changes
  const onFlip = useCallback((e) => {
    setCurrentPage(e.data + 1); // e.data is 0-indexed page number
  }, []);

  // Functions for navigation buttons
  const goToNextPage = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipNext();
    }
  };

  const goToPrevPage = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipPrev();
    }
  };

  return (
    <div className="flex flex-col items-center p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      {/* Container for the entire flipbook component */}
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        Interactive PDF Flipbook
      </h2>

      {pdfUrl ? (
        <div className="w-full max-w-5xl">
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(error) => console.error("Error loading PDF:", error)}
            className="flex justify-center items-center w-full" // Center the document
          >
            {numPages > 0 ? (
              <>
                <HTMLFlipBook
                  width={basePageWidth}
                  height={basePageHeight}
                  size="stretch" // Allows the book to stretch to fit the container
                  minWidth={300}
                  maxWidth={800} // Increased max-width for larger screens
                  minHeight={400}
                  maxHeight={1100} // Increased max-height
                  maxShadowOpacity={0.5}
                  showCover={true}
                  flippingTime={800}
                  onFlip={onFlip}
                  className="my-flipbook shadow-lg rounded-lg overflow-hidden" // Tailwind for book styling
                  ref={bookRef}
                  // Render all pages for the flipbook
                  // You can optimize by rendering only visible pages in more complex scenarios
                >
                  {Array.from(new Array(numPages), (el, index) => (
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      width={basePageWidth}
                      height={basePageHeight}
                    />
                  ))}
                </HTMLFlipBook>
              </>
            ) : (
              <p className="text-lg text-gray-600">Loading PDF...</p>
            )}
          </Document>
        </div>
      ) : (
        <p className="text-lg text-red-500 mt-4">
          Please provide a valid PDF URL to display the flipbook.
        </p>
      )}

      {numPages > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
          <div className="flex gap-3">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out"
            >
              Previous Page
            </button>
            <button
              onClick={goToNextPage}
              disabled={currentPage === numPages}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out"
            >
              Next Page
            </button>
          </div>
          <p className="text-lg font-medium text-gray-700 mt-2 sm:mt-0">
            Page <span className="font-bold">{currentPage}</span> /{" "}
            <span className="font-bold">{numPages}</span>
          </p>
        </div>
      )}
    </div>
  );
}

export default PdfFlipbook;
