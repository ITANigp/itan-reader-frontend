// app/components/PdfFlipbook.js
"use client";

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { Document, Page as ReactPdfPage, pdfjs } from "react-pdf";
import HTMLFlipBook from "react-pageflip";

// Configure react-pdf worker for Next.js
// Use the correct worker version that matches react-pdf@10.0.1 (API version 5.3.31)
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.3.31/build/pdf.worker.min.mjs`;
}

// Import react-pdf stylesheets for text layer and annotations
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// A functional component for individual pages within the flipbook.
// It needs to be forwardRef because HTMLFlipBook passes a ref to its children.
const Page = React.forwardRef(({ pageNumber, width, height }, ref) => {
  const [pageError, setPageError] = React.useState(null);
  const deviceScale =
    typeof window !== "undefined"
      ? Math.min(2, Math.max(1.25, window.devicePixelRatio || 1.25))
      : 1.25;
  const useSvg = width <= 640;

  return (
    <div
      ref={ref}
      className="flex justify-center items-center bg-gray-100 border border-gray-300 shadow-md overflow-visible md:overflow-hidden relative"
      style={{ padding: "0 4px" }}
    >
      {pageError ? (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-red-600 mb-2">Failed to load page {pageNumber}</p>
          <button
            onClick={() => {
              setPageError(null);
              // Force re-render
            }}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <ReactPdfPage
            pageNumber={pageNumber}
            width={width}
            height={height}
            renderMode={useSvg ? "svg" : "canvas"}
            scale={useSvg ? undefined : deviceScale}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            onLoadError={(error) => {
              console.error(`Error loading page ${pageNumber}:`, error);
              setPageError(
                error.message || `Failed to load page ${pageNumber}`
              );
            }}
            loading={
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500 text-sm">
                  Loading page {pageNumber}...
                </p>
              </div>
            }
            className="w-full h-full"
            style={{ display: "block" }}
          />
          {/* Optional: Page number overlay */}
          {/* <p className="absolute bottom-2 right-4 text-gray-600 text-sm">
            Page {pageNumber}
          </p> */}
        </>
      )}
    </div>
  );
});

Page.displayName = "Page"; // Good practice for debugging with React DevTools

function PdfFlipbook({ pdfUrl, authHeaders = {} }) {
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfData, setPdfData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [documentReady, setDocumentReady] = useState(false);
  const [viewMode, setViewMode] = useState("flipbook"); // 'flipbook' or 'normal'
  const bookRef = useRef(null);
  const containerRef = useRef(null);

  // Ensure worker is properly configured
  useEffect(() => {
    if (typeof window !== "undefined" && !pdfjs.GlobalWorkerOptions.workerSrc) {
      pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.3.31/build/pdf.worker.min.mjs`;
      console.log(
        "🔧 PDF.js worker configured:",
        pdfjs.GlobalWorkerOptions.workerSrc
      );
    }
  }, []);

  // Memoize PDF options to prevent unnecessary reloads
  const pdfOptions = useMemo(
    () => ({
      cMapUrl: "https://unpkg.com/pdfjs-dist@5.3.31/cmaps/",
      cMapPacked: true,
      standardFontDataUrl:
        "https://unpkg.com/pdfjs-dist@5.3.31/standard_fonts/",
    }),
    []
  );

  // Memoize file object to prevent unnecessary reloads
  const fileObject = useMemo(() => {
    if (!pdfData) return null;
    // Ensure we have a valid ArrayBuffer
    if (!(pdfData instanceof ArrayBuffer)) {
      console.error("PDF data is not an ArrayBuffer:", typeof pdfData);
      return null;
    }
    // Create a stable reference to prevent unnecessary Document reloads
    return pdfData;
  }, [pdfData]);

  // Define base dimensions for the flipbook pages.
  // These will be used by react-pdf's Page component.
  // The HTMLFlipBook component handles the responsiveness based on its own min/max width/height.
  const basePageWidth = 500;
  const basePageHeight = 700;
  const [pageSize, setPageSize] = useState({
    width: basePageWidth,
    height: basePageHeight,
  });

  // Compute responsive page size based on container width (flipbook only)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const ratio = basePageHeight / basePageWidth;
    const el = containerRef.current;

    const update = () => {
      const containerWidth = (el?.clientWidth ?? basePageWidth) - 16; // account for borders/margins to avoid clipping
      const width = Math.max(240, Math.min(containerWidth, 800));
      setPageSize({ width, height: Math.round(width * ratio) });
    };

    update();

    let ro;
    if ("ResizeObserver" in window && el) {
      ro = new ResizeObserver(update);
      ro.observe(el);
    } else {
      window.addEventListener("resize", update);
    }

    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", update);
    };
  }, []);

  // Fetch PDF with direct fetch (CORS configured on S3)
  useEffect(() => {
    const initializePdf = async () => {
      if (!pdfUrl) return;

      setLoading(true);
      setError(null);
      setDocumentReady(false);

      try {
        console.log("Initializing PDF from:", pdfUrl);

        // Fetch the PDF as an ArrayBuffer for better compatibility with react-pdf
        const response = await fetch(pdfUrl, {
          method: "GET",
          headers: {
            Accept: "application/pdf",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        console.log(
          "PDF fetched as ArrayBuffer, size:",
          arrayBuffer.byteLength
        );

        // Pass ArrayBuffer directly to Document component
        setPdfData(arrayBuffer);
        console.log("PDF ArrayBuffer set successfully");
      } catch (err) {
        console.error("Error fetching PDF:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializePdf();
  }, [pdfUrl]);

  // Callback for when the PDF document successfully loads
  const onDocumentLoadSuccess = useCallback(({ numPages }) => {
    console.log("🎉 PDF Document loaded successfully with", numPages, "pages");
    setNumPages(numPages);
    setCurrentPage(1); // Reset to first page on new document load
    setDocumentReady(true);
  }, []);

  // Callback for when document load fails
  const onDocumentLoadError = useCallback((error) => {
    console.error("❌ Error loading PDF document:", error);
    console.error("Error details:", {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
    setError(error.message || "Unknown PDF loading error");
    setLoading(false);
    setDocumentReady(false);
  }, []);

  // Callback for when the flipbook page changes
  const onFlip = useCallback(
    (e) => {
      if (viewMode === "flipbook") {
        setCurrentPage(e.data + 1); // e.data is 0-indexed page number
      }
    },
    [viewMode]
  );

  // Functions for navigation buttons
  const goToNextPage = () => {
    if (viewMode === "flipbook" && bookRef.current) {
      bookRef.current.pageFlip().flipNext();
    } else if (viewMode === "normal" && currentPage < numPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (viewMode === "flipbook" && bookRef.current) {
      bookRef.current.pageFlip().flipPrev();
    } else if (viewMode === "normal" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      {/* Container for the entire flipbook component */}
      <div className="w-full max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center sm:text-left">
            Interactive PDF Reader
          </h2>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-center gap-1 sm:gap-2 bg-white rounded-lg p-1 shadow-md mx-auto sm:mx-0 w-fit">
            <button
              onClick={() => setViewMode("flipbook")}
              className={`px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                viewMode === "flipbook"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <span className="hidden xs:inline">📖 Flipbook</span>
              <span className="xs:hidden">📖</span>
            </button>
            <button
              onClick={() => setViewMode("normal")}
              className={`px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                viewMode === "normal"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <span className="hidden xs:inline">📄 Normal PDF</span>
              <span className="xs:hidden">📄</span>
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-600">Loading PDF...</p>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-lg text-red-600 mb-4">
            Error loading PDF: {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      )}

      {pdfData && !loading && !error && fileObject ? (
        <div className="w-full max-w-5xl" ref={containerRef}>
          {console.log(
            "📄 Rendering Document component with fileObject:",
            fileObject
          )}
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-lg text-gray-600">Initializing PDF...</p>
                </div>
              </div>
            }
            error={
              <div className="flex flex-col items-center justify-center h-64">
                <p className="text-lg text-red-600 mb-4">
                  Failed to load PDF document
                </p>
                <button
                  onClick={() => {
                    setError(null);
                    setLoading(true);
                    window.location.reload();
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            }
            options={pdfOptions}
            className="flex justify-center items-center w-full"
          >
            {numPages > 0 && documentReady ? (
              viewMode === "flipbook" ? (
                <HTMLFlipBook
                  width={pageSize.width}
                  height={pageSize.height}
                  size="stretch"
                  minWidth={240}
                  maxWidth={800}
                  minHeight={Math.round(240 * (basePageHeight / basePageWidth))}
                  maxHeight={Math.round(800 * (basePageHeight / basePageWidth))}
                  maxShadowOpacity={0.5}
                  showCover={true}
                  flippingTime={800}
                  usePortrait={true}
                  mobileScrollSupport={true}
                  onFlip={onFlip}
                  className="my-flipbook shadow-lg rounded-lg overflow-hidden"
                  style={{ padding: "0 8px" }}
                  ref={bookRef}
                >
                  {Array.from(new Array(numPages), (el, index) => (
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      width={pageSize.width}
                      height={pageSize.height}
                    />
                  ))}
                </HTMLFlipBook>
              ) : (
                /* Normal PDF View */
                <div className="w-full">
                  <div className="flex flex-col items-center space-y-4">
                    {/* Single page view for normal mode */}
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                      <ReactPdfPage
                        pageNumber={currentPage}
                        width={Math.min(800, window.innerWidth * 0.9)}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                        loading={
                          <div className="flex justify-center items-center h-64">
                            <p className="text-gray-500 text-sm">
                              Loading page {currentPage}...
                            </p>
                          </div>
                        }
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                </div>
              )
            ) : null}
          </Document>
        </div>
      ) : (
        <p className="text-lg text-red-500 mt-4">
          Please provide a valid PDF URL to display the flipbook.
        </p>
      )}

      {numPages > 0 && (
        <div className="flex flex-col items-center justify-center gap-4 mt-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="px-3 sm:px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Previous Page</span>
                <span className="sm:hidden">Prev</span>
              </button>
              <button
                onClick={goToNextPage}
                disabled={currentPage === numPages}
                className="px-3 sm:px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Next Page</span>
                <span className="sm:hidden">Next</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <p className="text-base sm:text-lg font-medium text-gray-700 text-center">
                Page <span className="font-bold">{currentPage}</span> /{" "}
                <span className="font-bold">{numPages}</span>
              </p>

              {/* Quick page navigation for normal mode */}
              {viewMode === "normal" && (
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-600">
                    Go to:
                  </span>
                  <input
                    type="number"
                    min="1"
                    max={numPages}
                    value={currentPage}
                    onChange={(e) => {
                      const page = parseInt(e.target.value);
                      if (page >= 1 && page <= numPages) {
                        setCurrentPage(page);
                      }
                    }}
                    className="w-12 sm:w-16 px-1 sm:px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PdfFlipbook;
