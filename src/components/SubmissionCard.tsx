import { useCallback, useEffect, useRef, useState } from "react";
import { nip19 } from "nostr-tools";

import type { RankedSubmission } from "../hooks";
import { Author } from "./Author";
import { NoteContent } from "./NoteContent";
import { RateStars } from "./RateStars";

function EntryMeta({
  index,
  submission,
  isJudge,
  myRating,
}: {
  index: number;
  submission: RankedSubmission["submission"];
  isJudge: boolean;
  myRating: number | undefined;
}) {
  const nevent = nip19.neventEncode({ id: submission.id, author: submission.pubkey });

  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-4">
      <span className="font-mono text-xs leading-none text-flame/50 sm:text-sm">
        {String(index + 1).padStart(2, "0")}
      </span>
      <Author pubkey={submission.pubkey} size={32} />
      {submission.content && <NoteContent content={submission.content} maxLength={400} />}
      <a
        href={`https://njump.me/${nevent}`}
        target="_blank"
        rel="noreferrer"
        className="font-mono text-[11px] text-muted underline-offset-4 hover:text-flame hover:underline"
      >
        View original note ↗
      </a>
      {isJudge && <RateStars submission={submission} myRating={myRating} size={28} />}
    </div>
  );
}

export function SubmissionCard({
  item,
  index,
  isJudge,
  viewerPubkey,
}: {
  item: RankedSubmission;
  index: number;
  isJudge: boolean;
  viewerPubkey?: string;
}) {
  const { submission, score } = item;
  const myRating = viewerPubkey ? score.byJudge[viewerPubkey] : undefined;
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

  // Warm the cache for carousel slides once the entry is near the viewport
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

  return (
    <article
      ref={rootRef}
      style={{ animationDelay: `${Math.min(index, 12) * 45}ms` }}
      className="min-w-0 animate-[pop_0.4s_ease-out_both] lg:grid lg:grid-cols-[minmax(0,1fr)_min(17rem,32%)] lg:items-start lg:gap-8 xl:grid-cols-[minmax(0,1fr)_min(20rem,28%)] xl:gap-10"
    >
      <div className="relative flex min-h-[12rem] min-w-0 items-center justify-center overflow-hidden rounded-xl border border-edge bg-panel-2">
        {image ? (
          <img
            src={image}
            alt=""
            loading={hasCarousel ? "eager" : "lazy"}
            decoding="async"
            className="max-h-[min(72vh,720px)] max-w-full object-contain lg:max-h-[min(80vh,840px)]"
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
      </div>

      <aside className="mt-4 min-w-0 lg:sticky lg:top-20 lg:mt-0 lg:pt-1">
        <EntryMeta index={index} submission={submission} isJudge={isJudge} myRating={myRating} />
      </aside>
    </article>
  );
}
