import { useCallback, useEffect, useRef, useState } from "react";

import type { Submission } from "../types";

export function useEntryCarousel(submission: Submission) {
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLElement>(null);
  const hasImages = submission.images.length > 0;
  const image = hasImages ? submission.images[active] : null;
  const hasCarousel = submission.images.length > 1;

  const preloadCarousel = useCallback(() => {
    for (const url of submission.images) {
      const img = new Image();
      img.src = url;
    }
  }, [submission.images]);

  useEffect(() => {
    if (!hasCarousel) return;
    const el = rootRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          preloadCarousel();
          observer.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasCarousel, submission.id, preloadCarousel]);

  function showSlide(next: number) {
    preloadCarousel();
    setActive(next);
  }

  return { rootRef, active, image, hasCarousel, showSlide };
}

export function EntryCarousel({
  submission,
  active,
  image,
  hasCarousel,
  showSlide,
  imageClassName,
  tapToNavigate = false,
}: {
  submission: Submission;
  active: number;
  image: string | null;
  hasCarousel: boolean;
  showSlide: (next: number) => void;
  imageClassName: string;
  tapToNavigate?: boolean;
}) {
  const count = submission.images.length;
  const prev = () => showSlide((active - 1 + count) % count);
  const next = () => showSlide((active + 1) % count);

  return (
    <>
      {image ? (
        <img
          src={image}
          alt=""
          loading={hasCarousel ? "eager" : "lazy"}
          decoding="async"
          className={imageClassName}
        />
      ) : (
        <p className="px-6 py-16 text-left text-sm break-words text-muted [overflow-wrap:anywhere]">
          {submission.content.slice(0, 280) || "No preview"}
        </p>
      )}

      {count > 1 &&
        (tapToNavigate ? (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="group/nav absolute inset-y-0 left-0 flex w-1/2 cursor-pointer items-center justify-start pl-3 focus:outline-none"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/70 text-lg text-neutral-100 opacity-0 transition-opacity duration-150 group-hover/nav:opacity-100">
                ‹
              </span>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="group/nav absolute inset-y-0 right-0 flex w-1/2 cursor-pointer items-center justify-end pr-3 focus:outline-none"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/70 text-lg text-neutral-100 opacity-0 transition-opacity duration-150 group-hover/nav:opacity-100">
                ›
              </span>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute top-1/2 left-3 -translate-y-1/2 cursor-pointer rounded-full bg-ink/70 px-3 py-2 text-neutral-200 hover:bg-ink"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded-full bg-ink/70 px-3 py-2 text-neutral-200 hover:bg-ink"
              aria-label="Next image"
            >
              ›
            </button>
          </>
        ))}

      {count > 1 && (
        <span className="pointer-events-none absolute right-3 bottom-3 rounded-full bg-ink/70 px-2 py-0.5 font-mono text-[10px] text-neutral-300">
          {active + 1}/{count}
        </span>
      )}
    </>
  );
}
