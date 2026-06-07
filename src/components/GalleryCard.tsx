import type { Submission } from "../types";
import { Author } from "./Author";
import { EntryCarousel, useEntryCarousel } from "./EntryCarousel";
import { EntryDateLink } from "./EntryDateLink";
import { NoteContent } from "./NoteContent";

export function GalleryCard({ submission, index }: { submission: Submission; index: number }) {
  const carousel = useEntryCarousel(submission);

  return (
    <article
      ref={carousel.rootRef}
      style={{ animationDelay: `${Math.min(index, 8) * 30}ms` }}
      className="min-w-0 animate-[pop_0.4s_ease-out_both] overflow-hidden rounded-xl border border-edge bg-panel-2"
    >
      <div className="relative flex min-h-[10rem] items-center justify-center bg-ink">
        <EntryCarousel
          submission={submission}
          active={carousel.active}
          image={carousel.image}
          hasCarousel={carousel.hasCarousel}
          showSlide={carousel.showSlide}
          imageClassName="max-h-72 max-w-full object-contain sm:max-h-80"
        />
      </div>
      <div className="flex flex-col gap-3 p-4">
        <EntryDateLink submission={submission} />
        <Author pubkey={submission.pubkey} size={28} />
        {submission.content && <NoteContent content={submission.content} maxLength={220} />}
      </div>
    </article>
  );
}
