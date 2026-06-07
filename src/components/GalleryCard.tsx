import { nip19 } from "nostr-tools";

import type { Submission } from "../types";
import { Author } from "./Author";
import { EntryCarousel, useEntryCarousel } from "./EntryCarousel";
import { formatSubmissionDate } from "./EntryDateLink";

export function GalleryCard({ submission, index }: { submission: Submission; index: number }) {
  const carousel = useEntryCarousel(submission);
  const nevent = nip19.neventEncode({ id: submission.id, author: submission.pubkey });

  return (
    <article
      ref={carousel.rootRef}
      style={{ animationDelay: `${Math.min(index, 12) * 35}ms` }}
      className="group min-w-0 animate-[pop_0.5s_ease-out_both]"
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-panel-2 via-panel to-ink ring-1 ring-edge/50 transition-[box-shadow] duration-300 hover:shadow-[0_24px_48px_-24px_rgba(0,0,0,0.8)] hover:ring-edge">
        <div className="relative flex aspect-[4/5] items-center justify-center p-8 sm:p-10 md:p-12">
          <EntryCarousel
            submission={submission}
            active={carousel.active}
            image={carousel.image}
            hasCarousel={carousel.hasCarousel}
            showSlide={carousel.showSlide}
            imageClassName="max-h-full max-w-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)] transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 px-0.5">
        <Author pubkey={submission.pubkey} size={22} />
        <div className="flex shrink-0 items-center gap-2 font-mono text-[11px] tracking-wide text-muted/80">
          <span>{formatSubmissionDate(submission.createdAt)}</span>
          <a
            href={`https://njump.me/${nevent}`}
            target="_blank"
            rel="noreferrer"
            aria-label="View on njump"
            className="text-muted/60 transition-colors hover:text-flame"
          >
            ↗
          </a>
        </div>
      </div>
    </article>
  );
}
