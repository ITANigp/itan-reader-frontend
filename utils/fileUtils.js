/**
 * Utility functions for file handling in the reader application
 */

/**
 * Determine file format based on file extension or MIME type
 * @param {string} url - The URL or path to the file
 * @param {string} mimeType - Optional MIME type if available
 * @returns {string} - The detected format (pdf, epub, etc.)
 */
export function detectFileFormat(url, mimeType = null) {
  // If MIME type is provided, use it as primary detection method
  if (mimeType) {
    if (mimeType.includes("pdf")) return "pdf";
    if (mimeType.includes("epub")) return "epub";
    if (mimeType.includes("audio")) return "audio";
  }

  // Fallback to URL extension detection
  if (typeof url === "string") {
    const lowerUrl = url.toLowerCase();

    if (lowerUrl.endsWith(".pdf")) return "pdf";
    if (lowerUrl.endsWith(".epub")) return "epub";
    if (lowerUrl.match(/\.(mp3|wav|ogg|aac|m4a)$/)) return "audio";

    // Extract extension from paths with query parameters
    const matches = lowerUrl.match(/\.([a-z0-9]+)(\?|$)/i);
    if (matches && matches[1]) {
      const ext = matches[1].toLowerCase();
      if (ext === "pdf") return "pdf";
      if (ext === "epub") return "epub";
      if (["mp3", "wav", "ogg", "aac", "m4a"].includes(ext)) return "audio";
    }
  }

  // Default/unknown
  return "unknown";
}

/**
 * Validate if a file URL is supported by our readers
 * @param {string} url - The URL to validate
 * @returns {boolean} - Whether the file format is supported
 */
export function isSupportedFileFormat(url) {
  const format = detectFileFormat(url);
  return ["pdf", "epub", "audio"].includes(format);
}
