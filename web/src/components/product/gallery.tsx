"use client";
import * as React from "react";
import Image from "next/image";

export function Gallery({ images }: { images: string[] }) {
  const [active, setActive] = React.useState(0);
  const [zoom, setZoom] = React.useState(false);

  return (
    <div>
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-lg)] bg-zinc-100">
        <Image
          alt="Imagem do produto"
          src={images[active]}
          fill
          className={`${zoom ? "scale-110" : "scale-100"} object-cover transition-transform duration-200`}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <button
          type="button"
          aria-label={zoom ? "Reduzir zoom" : "Ampliar imagem"}
          onClick={() => setZoom((z) => !z)}
          className="absolute right-3 top-3 rounded bg-white/80 px-2 py-1 text-xs shadow hover:bg-white"
        >
          {zoom ? "-" : "+"} Zoom
        </button>
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              aria-label={`Imagem ${i + 1}`}
              onClick={() => setActive(i)}
              className={`relative aspect-square overflow-hidden rounded border ${i === active ? "border-zinc-900" : "border-zinc-200"}`}
            >
              <Image alt="thumb" src={img} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

