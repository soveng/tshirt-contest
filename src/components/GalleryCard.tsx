import type { Submission } from "../types";
import { Author } from "./Author";
import { EntryCarousel, useEntryCarousel } from "./EntryCarousel";
import { EntryDateLink } from "./EntryDateLink";

export function GalleryCard({ submission }: { submission: Submission }) {
  const carousel = useEntryCarousel(submission);

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
        <EntryDateLink submission={submission} compact />
      </div>
    </article>
  );
}
