type Props = {
  imageUrl?: string | null;
  alt: string;
};

export function RenderHistoryThumbnail({ imageUrl, alt }: Props) {
  if (!imageUrl) {
    return <div className="h-20 w-20 rounded-xl border" />;
  }

  return (
    <div className="h-20 w-20 overflow-hidden rounded-xl border">
      <img src={imageUrl} alt={alt} className="h-full w-full object-cover" />
    </div>
  );
}
