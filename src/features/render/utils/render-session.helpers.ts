export function normalizeImageUrl(
  apiUrl: string,
  url?: string | null,
): string | null {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  if (url.startsWith("/")) return url;
  return `${apiUrl}${url}`;
}
