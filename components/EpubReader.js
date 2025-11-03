"use client";

import { useEffect, useRef, useState } from "react";
import { ReactReader, ReactReaderStyle } from "react-reader";
import { useResizeDetector } from "react-resize-detector";
import ePub from "epubjs";
import { api } from "@/utils/auth/readerApi"; // Import the configured API instance

// Custom CSS to make the epub reader look nicer
const customEpubStyles = {
  container: {
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    borderRadius: "8px",
    backgroundColor: "#f8f9fa",
    overflow: "hidden",
  },
  readerArea: {
    padding: "20px",
    backgroundColor: "#fff",
    transition: "background-color 0.3s ease",
  },
  tocArea: {
    backgroundColor: "#f1f5f9",
    borderRight: "1px solid #e2e8f0",
  },
  tocButton: {
    backgroundColor: "#3b82f6",
    color: "#fff",
  },
};

export default function EpubReader({ epubUrl, bookId, authHeaders = {} }) {
  const [location, setLocation] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [epubBook, setEpubBook] = useState(null);
  const [epubArrayBuffer, setEpubArrayBuffer] = useState(null); // Store ArrayBuffer for ReactReader
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(epubUrl);
  const renditionRef = useRef(null);
  const { width, height, ref } = useResizeDetector();

  // Get or set stored location from localStorage
  // Track blob URLs that we create
  const [createdBlobUrls, setCreatedBlobUrls] = useState([]);

  // Add a blob URL to our tracking list
  const trackBlobUrl = (url) => {
    setCreatedBlobUrls((prev) => [...prev, url]);
  };

  useEffect(() => {
    // Clean up on unmount
    return () => {
      // Clean up any pending operations if needed
      if (renditionRef.current) {
        renditionRef.current.destroy();
      }

      // Clean up any blob URLs we created
      createdBlobUrls.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch (e) {
          console.error("Error revoking blob URL:", e);
        }
      });
    };
  }, [createdBlobUrls]);

  // Filter out noisy console errors
  useEffect(() => {
    // Store original console methods
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalLog = console.log;

    // Override console.error to filter out known noise
    console.error = (...args) => {
      const message = args.join(" ").toLowerCase();

      // Filter out specific noisy messages
      if (
        message.includes("content.opf") ||
        message.includes("404") ||
        message.includes("not found") ||
        message.includes("blocked script execution") ||
        message.includes("allow-scripts") ||
        message.includes("sandboxed") ||
        message.includes("about:srcdoc") ||
        message.includes("oebps")
      ) {
        return; // Don't log these messages
      }

      // Log everything else normally
      originalError.apply(console, args);
    };

    // Override console.warn for warnings
    console.warn = (...args) => {
      const message = args.join(" ").toLowerCase();

      if (
        message.includes("content.opf") ||
        message.includes("404") ||
        message.includes("blocked script") ||
        message.includes("sandboxed")
      ) {
        return; // Don't log these warnings
      }

      originalWarn.apply(console, args);
    };

    // Also intercept XMLHttpRequest to stop 404 network requests from showing
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, ...args) {
      // Check if this is one of the noisy requests
      if (
        typeof url === "string" &&
        (url.includes("content.opf") ||
          url.includes("OEBPS/OEBPS") ||
          url.includes("localhost:3003/OEBPS"))
      ) {
        // Create a mock request that doesn't actually execute
        return;
      }

      return originalXHROpen.call(this, method, url, ...args);
    };

    // Cleanup: restore original console methods on unmount
    return () => {
      console.error = originalError;
      console.warn = originalWarn;
      console.log = originalLog;
      XMLHttpRequest.prototype.open = originalXHROpen;
    };
  }, []);

  // Handle URL changes and fetch the EPUB
  // Function to test the reader works with a simple test EPUB
  const testWithSampleEpub = async () => {
    try {
      // Sample EPUB files that are known to work with EPUBjs
      const sampleUrls = [
        "https://s3.amazonaws.com/moby-dick/moby-dick.epub", // Public sample
        "https://github.com/IDPF/epub3-samples/raw/main/30/accessible_epub_3/accessible_epub_3.epub", // IDPF sample
      ];

      for (const sampleUrl of sampleUrls) {
        try {
          const response = await fetch(sampleUrl, {
            headers: {
              Accept: "application/epub+zip, application/octet-stream",
            },
            credentials: "omit",
            cache: "no-store",
          });

          if (response.ok) {
            // We don't actually render this, just testing if the fetch works
            return true;
          }
        } catch (e) {
          // Continue to next sample URL
        }
      }
      return false;
    } catch (error) {
      console.error("Error testing with sample EPUB:", error);
      return false;
    }
  };

  useEffect(() => {
    // Initialize from localStorage when component mounts or URL changes
    if (epubUrl) {
      // Reset state for new book
      setLoaded(false);
      setEpubBook(null);
      setError(null);
      setLoading(true);

      // Use the provided bookId if available, otherwise try to extract from URL
      const actualBookId = bookId || extractBookId(epubUrl);
      if (!actualBookId) {
        setError("Could not determine book ID from the provided URL or props.");
        setLoading(false);
        return;
      }

      // Try to load saved position
      const storedLocation = localStorage.getItem(
        `epub-location:${actualBookId}`
      );
      if (storedLocation) {
        setLocation(storedLocation);
      } else {
        setLocation(null); // Reset location for new book
      }

      setCurrentUrl(epubUrl); // Store original URL/ID for reference

      const loadBook = async () => {
        try {
          // Always use the backend API with book ID for better reliability and caching
          // This ensures we get the latest version and proper headers
          await fetchEpub(actualBookId);
        } catch (err) {
          console.error("Failed to load book:", err);
          setError(`Could not load the book: ${err.message}`);
          setLoading(false);
        }
      };

      // Start loading after a small delay to ensure state is updated
      setTimeout(loadBook, 100);
    }
  }, [epubUrl, bookId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Save location to localStorage when it changes - use book ID as key
  useEffect(() => {
    if (location && (bookId || currentUrl)) {
      const actualBookId = bookId || extractBookId(currentUrl);
      if (actualBookId) {
        localStorage.setItem(`epub-location:${actualBookId}`, location);
      }
    }
  }, [location, bookId, currentUrl]);

  // Function to extract the book ID from the URL or path
  // Track the original S3 URL for direct access (use ref to avoid re-renders)
  const originalS3UrlRef = useRef(null);

  const extractBookId = (url) => {
    if (!url) return null;

    // If it's already a book ID (UUID format), return it directly
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(url)) {
      return url;
    }

    // Check if it's an S3 URL with the book ID in the path
    // Example: https://itan-bucket-storage.s3.eu-north-1.amazonaws.com/niybte5d3694e820gdo7e83p94uk?response-...
    if (url.includes("amazonaws.com")) {
      // Store the original S3 URL for direct access later (use ref)
      originalS3UrlRef.current = url;

      // Extract the ID between the last / and the ?
      const matches = url.match(/\/([^\/\?]+)\?/);
      if (matches && matches[1]) {
        return matches[1]; // This is likely the book ID
      }
    }

    // For other URLs, try to extract from the path
    try {
      const urlObj = new URL(url);
      const pathSegments = urlObj.pathname.split("/").filter(Boolean);
      return pathSegments[pathSegments.length - 1]; // Last segment might be book ID
    } catch (e) {
      // If it's not a valid URL, just return as is - it might be a book ID
      return url;
    }
  };

  // Function to get the book content URL from the API - this is the canonical way to get URLs
  const getBookContentUrl = async (bookId) => {
    if (!bookId) {
      console.error("No book ID provided to getBookContentUrl");
      return null;
    }

    setRefreshing(true);

    try {
      // Use the configured API instance which has the correct base URL
      const response = await api.get(`/books/${bookId}/content`, {
        headers: {
          ...authHeaders,
          Accept: "application/json",
        },
        params: {
          direct_binary: true, // Use binary streaming instead of JSON URL
        },
      });

      // Axios returns data in response.data
      const data = response.data;

      if (data.url) {
        return data.url;
      } else {
        throw new Error("No URL in response from API");
      }
    } catch (err) {
      console.error("Error getting book content URL:", err);
      throw err; // Re-throw for handling by caller
    } finally {
      setRefreshing(false);
    }
  };

  // Fetch the entire EPUB file to avoid CORS issues
  const fetchEpub = async (urlOrBookId, retryCount = 0) => {
    if (!urlOrBookId) {
      setError("No book URL or ID provided");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const bookId = extractBookId(urlOrBookId);

      if (!bookId) {
        setError("Could not determine book ID from URL. Please try again.");
        return;
      }

      console.log(`📖 Loading EPUB for book: ${bookId}`);

      // PRIMARY STRATEGY: Try direct S3 URL first for best performance
      if (originalS3UrlRef.current) {
        console.log(
          "� Using direct S3 URL for fast loading:",
          originalS3UrlRef.current
        );
        try {
          const response = await fetch(originalS3UrlRef.current, {
            headers: {
              Accept: "application/epub+zip, application/octet-stream",
              "Cache-Control": "no-cache",
            },
            credentials: "omit",
            cache: "no-store",
            mode: "cors",
          });

          if (response.ok) {
            const arrayBuffer = await response.arrayBuffer();
            await processEpubFile(arrayBuffer);
            return;
          }
        } catch (s3Error) {
          console.warn(
            "S3 direct fetch failed, falling back to backend API:",
            s3Error
          );
        }
      }

      // ALTERNATIVE S3 STRATEGY: Try currentUrl if it's an S3 URL
      if (currentUrl && currentUrl.includes("amazonaws.com")) {
        try {
          const response = await fetch(currentUrl, {
            headers: {
              Accept: "application/epub+zip, application/octet-stream",
              "Cache-Control": "no-cache",
            },
            credentials: "omit",
            cache: "no-store",
            mode: "cors",
          });

          if (response.ok) {
            const arrayBuffer = await response.arrayBuffer();
            await processEpubFile(arrayBuffer);
            return;
          }
        } catch (s3CurrentError) {
          console.warn(
            "S3 currentUrl fetch failed, falling back to backend API:",
            s3CurrentError
          );
        }
      }

      // FALLBACK STRATEGY: Use backend proxy API only when S3 fails
      try {
        const response = await api.get(`/books/${bookId}/content`, {
          headers: {
            ...authHeaders,
            Accept: "application/epub+zip, application/octet-stream",
          },
          params: {
            direct_binary: true,
            debug_frontend: true,
          },
          responseType: "arraybuffer",
          timeout: 60000, // Increased timeout to 60 seconds to match backend response time
        });

        if (!response.data || response.data.byteLength < 1000) {
          throw new Error(
            `Invalid EPUB data received (${response.data?.byteLength || 0} bytes)`
          );
        }

        // Process the EPUB file using our helper function
        await processEpubFile(response.data);
      } catch (apiError) {
        console.error("Backend API failed:", apiError);

        // If backend fails and we have the original URL, try using it as a fallback
        if (currentUrl && currentUrl.includes("amazonaws.com")) {
          try {
            const response = await fetch(currentUrl, {
              headers: {
                Accept: "application/epub+zip, application/octet-stream",
                "Cache-Control": "no-cache",
              },
              credentials: "omit",
              cache: "no-store",
              mode: "cors",
            });

            if (response.ok) {
              const arrayBuffer = await response.arrayBuffer();
              await processEpubFile(arrayBuffer);
              return;
            }
          } catch (s3FallbackError) {
            console.error("S3 fallback also failed:", s3FallbackError);
          }
        }

        throw apiError; // Re-throw the original API error
      }
    } catch (error) {
      console.error("EPUB loading failed:", error);

      // Simple retry logic (max 1 retry to avoid long delays)
      if (retryCount < 1) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return fetchEpub(urlOrBookId, retryCount + 1);
      }

      // Final error handling
      if (error.message?.includes("timeout")) {
        setError(
          "⏱️ Backend API timeout - this usually means the server is not responding. Please check if the backend server is running on port 3000."
        );
      } else if (
        error.message?.includes("Network Error") ||
        error.message?.includes("ERR_CONNECTION_REFUSED")
      ) {
        setError(
          "🌐 Cannot connect to backend server. Please ensure the backend API is running on port 3000."
        );
      } else if (
        error.message?.includes("network") ||
        error.message?.includes("Failed to fetch")
      ) {
        setError(
          "🌐 Network error - please check your connection and try again."
        );
      } else {
        setError(`📚 Failed to load book: ${error.message}`);
      }
      setLoading(false);
    }
  };

  // Function to fetch EPUB directly from S3 URL
  const fetchEpubDirectly = async (s3Url) => {
    if (!s3Url) {
      setError("No S3 URL provided");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(s3Url, {
        headers: {
          Accept: "application/epub+zip, application/octet-stream",
          "Cache-Control": "no-cache",
        },
        credentials: "omit", // Don't send credentials to S3
        cache: "no-store",
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch from S3: ${response.status} ${response.statusText}`
        );
      }

      const arrayBuffer = await response.arrayBuffer();

      // Check if the response is too small - likely an error
      if (arrayBuffer.byteLength < 1000) {
        throw new Error(
          `Received very small file (${arrayBuffer.byteLength} bytes), likely an error`
        );
      }

      // Process the EPUB file
      await processEpubFile(arrayBuffer);
    } catch (error) {
      console.error("Failed to fetch EPUB directly:", error);
      setError(`Failed to load EPUB from S3: ${error.message}`);
      setLoading(false);
    }
  };

  // This comment replaces the duplicate effect that was removed

  const getRendition = (rendition) => {
    renditionRef.current = rendition;
    rendition.themes.fontSize("100%");

    // Register content hooks for handling images and preventing CORS issues
    rendition.hooks.content.register((contents) => {
      // This function runs whenever a new section/chapter is rendered
      // For example, handling images that might cause CORS issues
      const images = contents.document.querySelectorAll("img");
      images.forEach((img) => {
        // Handle external images if needed
      });
    });

    setLoaded(true);
  };

  // Process an EPUB file from ArrayBuffer
  const processEpubFile = async (arrayBuffer) => {
    try {
      // First, check if we got a valid ArrayBuffer
      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        throw new Error("Received empty data");
      }

      // Debug what was received by logging the first few bytes
      const firstBytes = new Uint8Array(arrayBuffer.slice(0, 16));

      // Check for PDF signature (if it's a PDF, reject it)
      if (
        firstBytes[0] === 0x25 &&
        firstBytes[1] === 0x50 &&
        firstBytes[2] === 0x44 &&
        firstBytes[3] === 0x46
      ) {
        throw new Error("Received a PDF file instead of EPUB");
      }

      // Check for EPUB signature (PK.. for ZIP file format)
      const isValidEpub = firstBytes[0] === 0x50 && firstBytes[1] === 0x4b;
      if (!isValidEpub) {
        // Check if it's JSON (likely an error message)
        try {
          const textDecoder = new TextDecoder();
          const jsonText = textDecoder.decode(arrayBuffer);
          if (jsonText.trim().startsWith("{")) {
            const jsonData = JSON.parse(jsonText);
            throw new Error(
              `API returned an error: ${jsonData.error || jsonData.message || JSON.stringify(jsonData)}`
            );
          }
        } catch (parseError) {
          // Not JSON or couldn't parse
          console.error("Couldn't parse as JSON:", parseError);
        }
      }

      // APPROACH 1: Create an EPUB book instance directly from the ArrayBuffer
      let book;

      try {
        // Method 1: CORRECT ArrayBuffer initialization - use empty constructor then open()
        book = ePub(); // Create empty book instance first

        await book.open(arrayBuffer); // Use open() method with ArrayBuffer

        await book.ready;

        if (book.spine && book.spine.items && book.spine.items.length > 0) {
          setEpubBook(book);
          setEpubArrayBuffer(arrayBuffer); // Store ArrayBuffer for ReactReader
          setLoading(false);
          return;
        }

        throw new Error(
          "EPUB file appears to be empty or corrupted - no readable chapters found"
        );
      } catch (parseError) {
        console.error("Failed to parse EPUB file:", parseError);
        throw new Error(`EPUB parsing failed: ${parseError.message}`);
      }
    } catch (error) {
      console.error("Failed to process EPUB file:", error);
      setError(`Unable to load EPUB: ${error.message}`);
      setLoading(false);
    }
  };

  const handleLocationChanged = (epubcifi) => {
    setLocation(epubcifi);
  };

  const handleRetryWithFreshUrl = async () => {
    const bookId = extractBookId(currentUrl);

    if (!bookId) {
      setError(
        "Could not determine book ID. Please go back to the library and try again."
      );
      return;
    }

    setRefreshing(true);
    setError("Requesting fresh link from server...");

    try {
      // Directly use the fetchEpub with book ID - it will get a fresh URL from the API
      await fetchEpub(bookId, 0);
    } catch (err) {
      console.error("Error retrying with fresh URL:", err);
      setError(`Failed to get a fresh link: ${err.message}`);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div
      ref={ref}
      style={{ position: "relative", height: "100vh", width: "100%" }}
    >
      {error && (
        <div className="flex items-center justify-center h-full w-full bg-gray-100 p-4">
          <div className="text-center max-w-lg bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-3 text-red-600">
              {error.includes("expired")
                ? "Book Link Expired"
                : "Error Loading EPUB"}
            </h3>
            <div className="text-gray-700 mb-4 whitespace-pre-line">
              {error}
            </div>

            <div className="text-left text-xs p-3 bg-gray-100 rounded mb-4 overflow-auto max-h-40">
              <p className="font-bold mb-1">Debug Info:</p>
              <ul className="list-disc pl-5">
                <li>Book ID: {extractBookId(currentUrl) || "Unknown"}</li>
                <li>API URL: {api.defaults.baseURL}/books/[id]/content</li>
                <li>
                  Authentication:{" "}
                  {authHeaders && authHeaders.Authorization
                    ? "Present"
                    : "Missing"}
                </li>
                <li>Browser: {navigator?.userAgent}</li>
              </ul>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {/* Always show the retry button for any error */}
              <button
                onClick={handleRetryWithFreshUrl}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                disabled={refreshing}
              >
                {refreshing
                  ? "Requesting Fresh Link..."
                  : "Try With Fresh Link"}
              </button>

              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Reload Page
              </button>
              <button
                onClick={() => window.history.back()}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Back to Library
              </button>
            </div>
            {error.includes("API might not be implemented") && (
              <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded-md text-sm">
                Note for developers: The API endpoint for refreshing book URLs
                needs to be implemented on the backend.
              </div>
            )}
          </div>
        </div>
      )}

      {(loading || refreshing) && (
        <div className="flex items-center justify-center h-full w-full bg-gray-100">
          <div className="text-center">
            <svg
              className="animate-spin h-10 w-10 text-blue-500 mx-auto mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-gray-600">
              {refreshing ? "Refreshing URL..." : "Loading EPUB book..."}
            </p>
          </div>
        </div>
      )}

      {(() => {
        const shouldShowReader =
          !loading && !refreshing && !error && !!epubBook && !!epubArrayBuffer;

        if (!shouldShowReader) return null;

        return (
          <div
            className="epub-reader-container"
            style={{ width: "100%", height: "100%", overflow: "hidden" }}
          >
            <ReactReader
              location={location}
              locationChanged={handleLocationChanged}
              url={epubArrayBuffer} // Pass the ArrayBuffer directly to ReactReader
              getRendition={getRendition}
              epubOptions={{
                flow: "paginated", // Better performance than "scrolled" with large books
                manager: "default", // More compatible than "continuous"
                allowScriptedContent: false, // Security: disable scripts in EPUBs
                allowPopups: false, // Security: prevent popups
                spread: "auto", // Dynamically adjust layout
              }}
              swipeable={true}
              tocChanged={(toc) => {
                // Silently handle TOC changes
              }}
              onReaderReady={() => {
                // Reader is ready
              }}
              onError={(err) => {
                // Filter out known harmless errors
                const errorMessage = err.message || err.toString();
                if (
                  errorMessage.toLowerCase().includes("content.opf") ||
                  errorMessage.toLowerCase().includes("404") ||
                  errorMessage.toLowerCase().includes("script execution") ||
                  errorMessage.toLowerCase().includes("oebps")
                ) {
                  return; // Don't show these errors
                }
                console.error("❌ ReactReader error:", err);
                setError(`Reader error: ${err.message}`);
              }}
              width={width || "100%"}
              height={height || "100%"}
              styles={{
                ...ReactReaderStyle,
                ...customEpubStyles,
              }}
            />
          </div>
        );
      })()}

      {(() => {
        const shouldShowNavigation =
          !loading && !refreshing && !error && !!epubBook;
        if (!shouldShowNavigation) return null;

        return (
          <div className="fixed bottom-0 left-0 right-0 p-2 bg-white bg-opacity-80 z-10 flex justify-center gap-2 shadow-lg border-t">
            <button
              onClick={() => renditionRef.current?.prev()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Previous
            </button>
            <button
              onClick={() => renditionRef.current?.next()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Next
            </button>
          </div>
        );
      })()}
    </div>
  );
}
