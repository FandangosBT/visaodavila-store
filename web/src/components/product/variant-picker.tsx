"use client";
import * as React from "react";

export function VariantPicker({
  colors,
  sizes,
  onChange,
}: {
  colors: string[];
  sizes: string[];
  onChange: (v: { color?: string; size?: string }) => void;
}) {
  const [color, setColor] = React.useState<string | undefined>(undefined);
  const [size, setSize] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    onChange({ color, size });
  }, [color, size]);

  return (
    <div className="space-y-4">
      {colors?.length > 0 && (
        <div>
          <div className="text-sm font-semibold text-zinc-800">Cor</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                aria-pressed={color === c}
                className={`rounded border px-2 py-1 text-sm ${color === c ? "border-zinc-900" : "border-zinc-300"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}
      {sizes?.length > 0 && (
        <div>
          <div className="text-sm font-semibold text-zinc-800">Tamanho</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                aria-pressed={size === s}
                className={`rounded border px-2 py-1 text-sm ${size === s ? "border-zinc-900" : "border-zinc-300"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

