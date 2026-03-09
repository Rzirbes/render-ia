"use client";

import { useState } from "react";
import { IconPhoto } from "@tabler/icons-react";

type Props = {
  imageUrl: string | null;
  alt: string;
};

export function RenderHistoryThumbnail({ imageUrl, alt }: Props) {
  const [hasError, setHasError] = useState(false);

  const showFallback = !imageUrl || hasError;

  return (
    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-zinc-900">
      {!showFallback ? (
        <img
          src={imageUrl}
          alt={alt}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setHasError(true)}
        />
      ) : null}

      {showFallback ? (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 text-text-muted">
          <IconPhoto size={20} />
        </div>
      ) : null}
    </div>
  );
}
