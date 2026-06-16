import type { RankedSubmission } from "../hooks";
import { Author } from "./Author";
import { EntryCarousel, useEntryCarousel } from "./EntryCarousel";
import { EntryDateLink } from "./EntryDateLink";
import { ResultsScore } from "./ResultsScore";

function WinnerCard({
  item,
  featured,
}: {
  item: RankedSubmission;
  featured?: boolean;
}) {
  const { submission, score, rank } = item;
  const carousel = useEntryCarousel(submission);

  return (
    <article
      ref={carousel.rootRef}
      className={`overflow-hidden rounded-xl border border-edge bg-panel-2 ${
        featured ? "sm:scale-[1.03] sm:shadow-lg sm:shadow-flame/5" : ""
      }`}
    >
      <div className="relative bg-ink">
        <EntryCarousel
          submission={submission}
          active={carousel.active}
          image={carousel.image}
          hasCarousel={carousel.hasCarousel}
          showSlide={carousel.showSlide}
          imageClassName="block w-full object-cover"
          tapToNavigate
        />
        <span
          className="pointer-events-none absolute left-3 top-3 z-10 rounded-full bg-flame px-2.5 py-1 font-mono text-xs font-semibold text-ink"
        >
          #{rank}
        </span>
      </div>
      <div className="space-y-3 px-4 py-4">
        <Author pubkey={submission.pubkey} size={24} />
        <ResultsScore score={score} starSize={featured ? 18 : 16} />
        <EntryDateLink submission={submission} compact />
      </div>
    </article>
  );
}

export function WinnersPodium({ items }: { items: RankedSubmission[] }) {
  if (items.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-3 sm:gap-6 sm:items-end">
      {items.map((item, index) => (
        <WinnerCard key={item.submission.id} item={item} featured={index === 0} />
      ))}
    </div>
  );
}
