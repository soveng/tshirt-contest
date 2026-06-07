import type { Submission } from "../types";
import { Author } from "./Author";
import { EntryCarousel, useEntryCarousel } from "./EntryCarousel";
import { EntryDateLink } from "./EntryDateLink";

export function GalleryCard({ submission }: { submission: Submission }) {
  const carousel = useEntryCarousel(submission);

  return (
    <article
      ref={carousel.rootRef}
      className="mb-5 break-inside-avoid overflow-hidden rounded-xl border border-edge bg-panel-2"
    >
      <div className="relative bg-ink">
        <EntryCarousel
          submission={submission}
          active={carousel.active}
          image={carousel.image}
          hasCarousel={carousel.hasCarousel}
          showSlide={carousel.showSlide}
          imageClassName="block w-full"
        />
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-edge/70 px-2.5 py-2">
        <Author pubkey={submission.pubkey} size={20} />
        <EntryDateLink submission={submission} compact />
      </div>
    </article>
  );
}
