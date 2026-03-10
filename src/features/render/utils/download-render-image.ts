export async function downloadRenderImage(
  imageUrl: string,
  fileName = "render.jpg",
) {
  const response = await fetch(imageUrl);

  if (!response.ok) {
    throw new Error("Não foi possível baixar a imagem.");
  }

  const blob = await response.blob();
  const blobUrl = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(blobUrl);
}

export function getRenderDownloadFileName(renderId: string, mimeType?: string) {
  const extension =
    mimeType === "image/png"
      ? "png"
      : mimeType === "image/webp"
        ? "webp"
        : "jpg";

  return `render-${renderId}.${extension}`;
}
