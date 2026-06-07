import { useEffect, useState } from "react";
import { nip19 } from "nostr-tools";

import { CONTEST } from "../config";
import { useActiveAccount, useIsJudge, type RankedSubmission } from "../hooks";
import { Author } from "./Author";
import { NoteContent } from "./NoteContent";
import { RateStars } from "./RateStars";

function JudgePanel({ item }: { item: RankedSubmission }) {
  const account = useActiveAccount();
  const isJudge = useIsJudge();
  if (!isJudge) return null;

  const myRating = account ? item.score.byJudge[account.pubkey] : undefined;

  return (
    <div className="rounded-xl border border-edge bg-panel-2 p-4">
      <div className="mb-2 text-sm text-neutral-300">
        {myRating ? "Your rating" : "Cast your rating"}
      </div>
      <RateStars submission={item.submission} myRating={myRating} size={34} />
    </div>
  );
}

export function SubmissionModal({ item, onClose }: { item: RankedSubmission; onClose: () => void }) {
  const { submission } = item;
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && submission.images.length > 1)
        setActive((a) => (a - 1 + submission.images.length) % submission.images.length);
      if (e.key === "ArrowRight" && submission.images.length > 1)
        setActive((a) => (a + 1) % submission.images.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, submission.images.length]);

  // Warm the cache for the other images so cycling through them is instant
  useEffect(() => {
    for (const url of submission.images) {
      const img = new Image();
      img.src = url;
    }
  }, [submission.id]);

  const nevent = nip19.neventEncode({ id: submission.id, author: submission.pubkey });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-4xl animate-[pop_0.25s_ease-out_both] flex-col overflow-hidden rounded-2xl border border-edge bg-panel shadow-2xl md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex flex-1 items-center justify-center bg-ink md:w-3/5">
          {submission.images.length > 0 ? (
            <img
              src={submission.images[active]}
              alt=""
              className="max-h-[45vh] w-full object-contain md:max-h-[90vh]"
            />
          ) : (
            <p className="p-8 text-center text-sm break-words whitespace-pre-wrap text-muted [overflow-wrap:anywhere]">
              {submission.content || "No image in this entry"}
            </p>
          )}
          {submission.images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() =>
                  setActive((a) => (a - 1 + submission.images.length) % submission.images.length)
                }
                className="absolute left-3 cursor-pointer rounded-full bg-ink/70 px-3 py-2 text-neutral-200 hover:bg-ink"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => setActive((a) => (a + 1) % submission.images.length)}
                className="absolute right-3 cursor-pointer rounded-full bg-ink/70 px-3 py-2 text-neutral-200 hover:bg-ink"
              >
                ›
              </button>
              <span className="absolute bottom-3 rounded-full bg-ink/70 px-2 py-0.5 font-mono text-[10px] text-neutral-300">
                {active + 1}/{submission.images.length}
              </span>
            </>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-4 overflow-y-auto p-5 md:w-2/5">
          <div className="flex items-start justify-between gap-3">
            <Author pubkey={submission.pubkey} size={36} />
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg border border-edge px-2.5 py-1 text-sm text-muted hover:text-neutral-200"
            >
              Esc
            </button>
          </div>

          {submission.content && <NoteContent content={submission.content} maxLength={600} />}

          <JudgePanel item={item} />

          <a
            href={`https://njump.me/${nevent}`}
            target="_blank"
            rel="noreferrer"
            className="mt-auto font-mono text-[11px] text-muted underline-offset-4 hover:text-flame hover:underline"
          >
            View original note ↗
          </a>
          <span className="sr-only">Rate from {CONTEST.minRating} to {CONTEST.maxRating}</span>
        </div>
      </div>
    </div>
  );
}
