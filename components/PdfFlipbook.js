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
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  BookOpen,
  ScrollText,
} from "lucide-react";

// Configure react-pdf worker for Next.js (API version 5.3.31)
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc =
    `https://unpkg.com/pdfjs-dist@5.3.31/build/pdf.worker.min.mjs`;
}

// react-pdf styles
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Single PDF page (wrapped for flipbook)
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
            onClick={() => setPageError(null)}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      ) : (
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
            setPageError(error.message || `Failed to load page ${pageNumber}`);
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
      )}
    </div>
  );
});
Page.displayName = "Page";

function PdfFlipbook({ pdfUrl, authHeaders = {} }) {
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfData, setPdfData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [documentReady, setDocumentReady] = useState(false);

  const [viewMode, setViewMode] = useState("flipbook"); // 'flipbook' | 'normal'
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const bookRef = useRef(null);
  const containerRef = useRef(null);

  // worker hardening
  useEffect(() => {
    if (typeof window !== "undefined" && !pdfjs.GlobalWorkerOptions.workerSrc) {
      pdfjs.GlobalWorkerOptions.workerSrc =
        `https://unpkg.com/pdfjs-dist@5.3.31/build/pdf.worker.min.mjs`;
    }
  }, []);

  // Options for pdf.js
  const pdfOptions = useMemo(
    () => ({
      cMapUrl: "https://unpkg.com/pdfjs-dist@5.3.31/cmaps/",
      cMapPacked: true,
      standardFontDataUrl: "https://unpkg.com/pdfjs-dist@5.3.31/standard_fonts/",
    }),
    []
  );

  // Use ArrayBuffer for reliability
  const fileObject = useMemo(() => {
    if (!pdfData) return null;
    if (!(pdfData instanceof ArrayBuffer)) {
      console.error("PDF data is not an ArrayBuffer:", typeof pdfData);
      return null;
    }
    return pdfData;
  }, [pdfData]);

  // Base page dimensions for flip mode
  const basePageWidth = 500;
  const basePageHeight = 700;
  const [pageSize, setPageSize] = useState({
    width: basePageWidth,
    height: basePageHeight,
  });

  // Responsive sizing (flip mode)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const ratio = basePageHeight / basePageWidth;
    const el = containerRef.current;

    const update = () => {
      const containerWidth = (el?.clientWidth ?? basePageWidth) - 16;
      const width = Math.max(240, Math.min(containerWidth / 2, 800)); // /2 to leave room for spread
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

  // Fetch PDF (respects auth headers)
  useEffect(() => {
    const initializePdf = async () => {
      if (!pdfUrl) return;

      setLoading(true);
      setError(null);
      setDocumentReady(false);

      try {
        const response = await fetch(pdfUrl, {
          method: "GET",
          headers: {
            Accept: "application/pdf",
            ...authHeaders,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        setPdfData(arrayBuffer);
      } catch (err) {
        console.error("Error fetching PDF:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    initializePdf();
  }, [pdfUrl, authHeaders]);

  const onDocumentLoadSuccess = useCallback(({ numPages }) => {
    setNumPages(numPages);
    setCurrentPage(1);
    setDocumentReady(true);
  }, []);

  const onDocumentLoadError = useCallback((err) => {
    console.error("PDF load error:", err);
    setError(err.message || "Unknown PDF loading error");
    setLoading(false);
    setDocumentReady(false);
  }, []);

  // Flip callback (keeps UI in sync)
  const onFlip = useCallback(
    (e) => {
      if (viewMode === "flipbook") {
        setCurrentPage(e.data + 1); // 0-index to 1-index
      }
    },
    [viewMode]
  );

  // Navigation
  const goToNextPage = () => {
    if (viewMode === "flipbook" && bookRef.current) {
      bookRef.current.pageFlip().flipNext();
    } else if (viewMode === "normal" && currentPage < numPages) {
      setCurrentPage((p) => p + 1);
      const el = document.getElementById(`pdf-scroll-page-${currentPage + 1}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  const goToPrevPage = () => {
    if (viewMode === "flipbook" && bookRef.current) {
      bookRef.current.pageFlip().flipPrev();
    } else if (viewMode === "normal" && currentPage > 1) {
      setCurrentPage((p) => p - 1);
      const el = document.getElementById(`pdf-scroll-page-${currentPage - 1}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Zoom
  const zoomIn = () => setZoom((z) => Math.min(2.5, +(z + 0.1).toFixed(2)));
  const zoomOut = () => setZoom((z) => Math.max(0.6, +(z - 0.1).toFixed(2)));

  // Fullscreen
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement && containerRef.current) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else if (document.exitFullscreen) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (e) {
      console.warn("Fullscreen not available:", e);
    }
  };
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Normal (scroll) page width (reacts to zoom + container width)
  const [scrollPageWidth, setScrollPageWidth] = useState(900);
  useEffect(() => {
    const update = () => {
      const w = Math.min(
        900,
        (containerRef.current?.clientWidth || 900) * 0.98
      );
      setScrollPageWidth(Math.round(w * zoom));
    };
    update();
    let ro;
    if (typeof window !== "undefined" && "ResizeObserver" in window && containerRef.current) {
      ro = new ResizeObserver(update);
      ro.observe(containerRef.current);
    } else {
      window.addEventListener("resize", update);
    }
    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", update);
    };
  }, [zoom]);

  return (
    <div className="flex flex-col items-center bg-gray-50 min-h-screen">
      {/* Top toolbar (Flip/Scroll, Zoom, Fullscreen) */}
      <div className="w-full sticky top-0 z-30 bg-white/90 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
          {/* Mode toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("flipbook")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition ${
                viewMode === "flipbook"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              title="Flip mode"
            >
              <BookOpen className="w-4 h-4" />
              Flip
            </button>
            <button
              onClick={() => setViewMode("normal")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition ${
                viewMode === "normal"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              title="Scroll mode"
            >
              <ScrollText className="w-4 h-4" />
              Scroll
            </button>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={zoomOut}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              title="Zoom out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <span className="px-2 text-sm text-gray-600 w-14 text-center">
              {(zoom * 100).toFixed(0)}%
            </span>
            <button
              onClick={zoomIn}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              title="Zoom in"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="ml-2 p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              title="Fullscreen"
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5" />
              ) : (
                <Maximize2 className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Book container */}
      <div
        className="w-full max-w-6xl px-4 py-6 relative"
        ref={containerRef}
      >
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
          <Document
            file={fileObject}
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
                // FLIP MODE (two-page open book)
                <div className="relative w-full flex justify-center items-center overflow-hidden">
                  {/* Side arrows */}
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 shadow hover:bg-white disabled:opacity-50"
                    title="Previous"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                  </button>

                  <div
                    className="transition-transform"
                    style={{
                      transform: `scale(${zoom})`,
                      transformOrigin: "center",
                    }}
                  >
                    <HTMLFlipBook
                      width={pageSize.width}
                      height={pageSize.height}
                      size="stretch"
                      minWidth={240}
                      maxWidth={800}
                      minHeight={Math.round(
                        240 * (basePageHeight / basePageWidth)
                      )}
                      maxHeight={Math.round(
                        800 * (basePageHeight / basePageWidth)
                      )}
                      maxShadowOpacity={0.5}
                      showCover={false}
                      flippingTime={800}
                      // two-page spread; no scroll in flip mode
                      usePortrait={false}
                      mobileScrollSupport={false}
                      onFlip={onFlip}
                      className="shadow-xl rounded-lg overflow-hidden bg-gray-200"
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
                  </div>

                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === numPages}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 shadow hover:bg-white disabled:opacity-50"
                    title="Next"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-700" />
                  </button>

                  {/* Page count bottom center */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 px-3 py-1 rounded shadow text-sm text-gray-700">
                    Page <span className="font-semibold">{currentPage}</span> /{" "}
                    {numPages}
                  </div>
                </div>
              ) : (
                // SCROLL MODE
                <div
                  className="w-full bg-white py-6"
                  style={{ minHeight: "70vh" }}
                >
                  <div className="flex flex-col items-center gap-6">
                    {Array.from({ length: numPages }, (_, i) => (
                      <div
                        className="flex justify-center w-full"
                        key={`pdf-page-container-${i + 1}`}
                        id={`pdf-scroll-page-${i + 1}`}
                      >
                        <ReactPdfPage
                          key={`pdf-page-${i + 1}`}
                          pageNumber={i + 1}
                          width={scrollPageWidth}
                          renderTextLayer={true}
                          renderAnnotationLayer={true}
                          loading={
                            <div className="flex justify-center items-center h-64">
                              <p className="text-gray-500 text-lg font-bold">
                                Loading page {i + 1}...
                              </p>
                            </div>
                          }
                          className="w-full h-full border-b border-gray-200"
                          onRenderSuccess={() => setCurrentPage(i + 1)}
                        />
                      </div>
                    ))}

                    {/* Page count bottom center (scroll mode too) */}
                    <div className="sticky bottom-3 self-center bg-white/90 px-3 py-1 rounded shadow text-sm text-gray-700">
                      Page <span className="font-semibold">{currentPage}</span>{" "}
                      / {numPages}
                    </div>
                  </div>
                </div>
              )
            ) : null}
          </Document>
        ) : !loading && !error ? (
          <p className="text-lg text-red-500 mt-4">
            Please provide a valid PDF URL to display the flipbook.
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default PdfFlipbook;

