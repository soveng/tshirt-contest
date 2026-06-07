import { useEffect, useRef, useState } from "react";

export type SortOption = "newest" | "oldest" | "random";

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "random", label: "Random" },
];

function SortIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <rect x="1" y="3" width="9" height="1.7" rx="0.85" />
      <rect x="1" y="7.15" width="6" height="1.7" rx="0.85" />
      <rect x="1" y="11.3" width="3" height="1.7" rx="0.85" />
    </svg>
  );
}

export function SortMenu({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (next: SortOption) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Sort submissions"
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex cursor-pointer items-center gap-1.5 font-mono text-xs text-muted transition-colors hover:text-flame sm:text-sm"
      >
        <SortIcon />
        <span className="hidden sm:inline">Sort</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute top-full left-0 z-40 mt-2 min-w-38 overflow-hidden rounded-lg border border-edge bg-panel shadow-xl"
        >
          {OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="menuitemradio"
              aria-checked={value === opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`flex w-full cursor-pointer items-center justify-between gap-3 px-3 py-2 text-left font-mono text-xs transition-colors hover:bg-panel-2 ${
                value === opt.value ? "text-flame" : "text-neutral-300"
              }`}
            >
              {opt.label}
              {value === opt.value && <span aria-hidden>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
