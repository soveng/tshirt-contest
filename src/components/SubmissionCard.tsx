import { useState } from "react";

import type { RankedSubmission } from "../hooks";
import { Author } from "./Author";
import { RateStars } from "./RateStars";

export function SubmissionCard({
  item,
  index,
  isJudge,
  viewerPubkey,
  onOpen,
}: {
  item: RankedSubmission;
  index: number;
  isJudge: boolean;
  viewerPubkey?: string;
  onOpen: () => void;
}) {
  const { submission, score } = item;
  const myRating = viewerPubkey ? score.byJudge[viewerPubkey] : undefined;
  const [active, setActive] = useState(0);
  const hasImages = submission.images.length > 0;
  const image = hasImages ? submission.images[active] : null;

  return (
    <article
      style={{ animationDelay: `${Math.min(index, 12) * 45}ms` }}
      className="animate-[pop_0.4s_ease-out_both]"
    >
      <div className="relative overflow-hidden rounded-xl border border-edge bg-panel-2">
        {image ? (
          <button
            type="button"
            onClick={onOpen}
            aria-label="Open entry"
            className="block w-full cursor-pointer"
          >
            <img
              src={image}
              alt=""
              loading="lazy"
              className="mx-auto max-h-[min(72vh,720px)] w-full object-contain"
            />
          </button>
        ) : (
          <p className="px-6 py-16 text-center text-sm text-muted">
            {submission.content.slice(0, 280) || "No preview"}
          </p>
        )}

        {submission.images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() =>
                setActive((a) => (a - 1 + submission.images.length) % submission.images.length)
              }
              className="absolute top-1/2 left-3 -translate-y-1/2 cursor-pointer rounded-full bg-ink/70 px-3 py-2 text-neutral-200 hover:bg-ink"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => setActive((a) => (a + 1) % submission.images.length)}
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

      <div className="mt-4 flex flex-col gap-3">
        <Author pubkey={submission.pubkey} size={32} />

        {submission.content && (
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted">
            {submission.content.slice(0, 400)}
          </p>
        )}

        {isJudge && <RateStars submission={submission} myRating={myRating} size={28} spread />}
      </div>
    </article>
  );
}
