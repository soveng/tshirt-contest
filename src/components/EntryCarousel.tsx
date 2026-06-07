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
}: {
  submission: Submission;
  active: number;
  image: string | null;
  hasCarousel: boolean;
  showSlide: (next: number) => void;
  imageClassName: string;
}) {
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

      {submission.images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() =>
              showSlide((active - 1 + submission.images.length) % submission.images.length)
            }
            className="absolute top-1/2 left-3 -translate-y-1/2 cursor-pointer rounded-full bg-ink/70 px-3 py-2 text-neutral-200 hover:bg-ink"
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => showSlide((active + 1) % submission.images.length)}
            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded-full bg-ink/70 px-3 py-2 text-neutral-200 hover:bg-ink"
            aria-label="Next image"
          >
            ›
          </button>
          <span className="absolute right-3 bottom-3 rounded-full bg-ink/70 px-2 py-0.5 font-mono text-[10px] text-neutral-300">
            {active + 1}/{submission.images.length}
          </span>
        </>
      )}
    </>
  );
}
