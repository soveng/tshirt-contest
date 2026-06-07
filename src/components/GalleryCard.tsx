import { nip19 } from "nostr-tools";

import type { Submission } from "../types";
import { Author } from "./Author";
import { EntryCarousel, useEntryCarousel } from "./EntryCarousel";
import { formatSubmissionDate } from "./EntryDateLink";

export function GalleryCard({ submission }: { submission: Submission }) {
  const carousel = useEntryCarousel(submission);
  const nevent = nip19.neventEncode({ id: submission.id, author: submission.pubkey });

  return (
    <article ref={carousel.rootRef} className="overflow-hidden rounded-xl border border-edge bg-panel-2">
      <div className="relative flex min-h-[17rem] items-center justify-center bg-ink p-4 sm:min-h-[22rem] sm:p-6 lg:min-h-[26rem]">
        <EntryCarousel
          submission={submission}
          active={carousel.active}
          image={carousel.image}
          hasCarousel={carousel.hasCarousel}
          showSlide={carousel.showSlide}
          imageClassName="max-h-full max-w-full object-contain"
        />
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-edge/70 px-2.5 py-2">
        <Author pubkey={submission.pubkey} size={20} />
        <div className="flex shrink-0 items-center gap-1.5 font-mono text-[10px] text-muted">
          <span>{formatSubmissionDate(submission.createdAt)}</span>
          <a
            href={`https://njump.me/${nevent}`}
            target="_blank"
            rel="noreferrer"
            aria-label="View on njump"
            className="text-muted/70 transition-colors hover:text-flame"
          >
            ↗
          </a>
        </div>
      </div>
    </article>
  );
}
