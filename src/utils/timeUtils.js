/**
 * Time utility functions for formatting dates and times
 */

/**
 * Formats date to relative time string (e.g., "2 hours ago")
 */
export function formatTimeFromNow(dateStr) {
  if (!dateStr) return "N/A";

  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? "s" : ""} ago`;
  if (diffDay < 30) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;

  return date.toLocaleDateString();
}

/**
 * Formats date to readable date and time string
 */
export function formatDateTime(dateStr) {
  if (!dateStr) return "N/A";

  const date = new Date(dateStr);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return date.toLocaleDateString("en-US", options);
}

/**
 * Legacy export for backward compatibility
 */
export const formatDistanceToNow = formatTimeFromNow;
