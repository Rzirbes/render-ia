const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function getRenderImageUrl(url: string | null | undefined) {
  if (!url) return null;

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  if (!API_URL) {
    return url;
  }

  return `${API_URL}${url}`;
}
