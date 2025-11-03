/**
 * Helper function to load and navigate to the EPUB reader page with proper parameters
 * @param {string} epubUrl - URL to the EPUB file
 * @param {string} bookTitle - Title of the book
 * @param {object} router - Next.js router instance
 */
export function loadEpubReader(epubUrl, bookTitle = "Book", router = null) {
  const navRouter =
    router || (typeof window !== "undefined" ? window.location : null);

  if (!navRouter) {
    console.error("Router not available for navigation");
    return;
  }

  // Encode parameters properly
  const encodedUrl = encodeURIComponent(epubUrl);
  const encodedTitle = encodeURIComponent(bookTitle);

  // Either use Next.js router or fallback to window.location
  if (typeof navRouter.push === "function") {
    navRouter.push(`/reader/epub?url=${encodedUrl}&title=${encodedTitle}`);
  } else {
    navRouter.href = `/reader/epub?url=${encodedUrl}&title=${encodedTitle}`;
  }
}
