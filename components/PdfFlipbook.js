import React, { useState, useRef, useCallback, useEffect } from "react";
import { Document, Page as ReactPdfPage, pdfjs } from "react-pdf";
import HTMLFlipBook from "react-pageflip";

// Configure react-pdf worker to load from the public directory.
// You MUST place 'pdf.worker.min.js' in your public folder.
// For example, if you download it to 'public/pdf.worker.min.js',
// then the path here should be '/pdf.worker.min.js'.
// You can get the worker file from the 'pdfjs-dist/build' directory
// after installing 'react-pdf' or from a CDN like:
// https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`; // Updated path

// Import react-pdf stylesheets for text layer and annotations
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// A functional component for individual pages within the flipbook.
// It needs to be forwardRef because HTMLFlipBook passes a ref to its children.
const Page = React.forwardRef(({ pageNumber, width, height }, ref) => (
  <div
    ref={ref}
    className="flex justify-center items-center bg-gray-100 border border-gray-300 shadow-md overflow-hidden relative rounded-lg" // Added rounded-lg
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
));

Page.displayName = "Page"; // Good practice for debugging with React DevTools

function PdfFlipbook({ pdfUrl }) {
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null); // State to store local blob URL
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

  // Effect to fetch PDF as a Blob and convert to an object URL
  // This helps bypass CORS for the PDF document itself.
  useEffect(() => {
    const loadPdfBlob = async () => {
      if (!pdfUrl) {
        setPdfBlobUrl(null); // Clear URL if pdfUrl is not provided
        setNumPages(0);
        return;
      }
      try {
        const res = await fetch(pdfUrl);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const blob = await res.blob();
        const localUrl = URL.createObjectURL(blob);
        setPdfBlobUrl(localUrl);
      } catch (err) {
        console.error("Failed to fetch PDF blob:", err);
        setPdfBlobUrl(null); // Clear URL on error
        setNumPages(0);
      }
    };

    loadPdfBlob();

    // Cleanup function to revoke the object URL when the component unmounts
    // or when pdfUrl changes.
    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [pdfUrl, pdfBlobUrl]); // Include pdfBlobUrl in dependency array for cleanup

  return (
    <div className="flex flex-col items-center p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen font-sans">
      {" "}
      {/* Added font-sans */}
      {/* Container for the entire flipbook component */}
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        Interactive PDF Flipbook
      </h2>
      {pdfBlobUrl ? (
        <div className="w-full max-w-5xl">
          <Document
            file={pdfBlobUrl} // Use the local blob URL
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(error) => console.error("Error loading PDF:", error)}
            className="flex justify-center items-center w-full" // Center the document
            loading={
              <p className="text-lg text-gray-600">Loading PDF document...</p>
            } // Custom loading message for Document
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
              <p className="text-lg text-gray-600">Processing PDF pages...</p> // Message after document loads but before pages render
            )}
          </Document>
        </div>
      ) : (
        <p className="text-lg text-red-500 mt-4">
          {pdfUrl
            ? "Fetching PDF content..."
            : "Please provide a valid PDF URL to display the flipbook."}
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
