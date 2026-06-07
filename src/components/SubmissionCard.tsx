import type { RankedSubmission } from "../hooks";
import { Author } from "./Author";
import { EntryCarousel, useEntryCarousel } from "./EntryCarousel";
import { EntryDateLink } from "./EntryDateLink";
import { NoteContent } from "./NoteContent";
import { RateStars } from "./RateStars";

function JudgeEntryMeta({
  submission,
  isJudge,
  myRating,
}: {
  submission: RankedSubmission["submission"];
  isJudge: boolean;
  myRating: number | undefined;
}) {
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-4">
      <EntryDateLink submission={submission} />
      <Author pubkey={submission.pubkey} size={32} />
      {submission.content && <NoteContent content={submission.content} maxLength={400} />}
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
  const carousel = useEntryCarousel(submission);

  return (
    <article
      ref={carousel.rootRef}
      style={{ animationDelay: `${Math.min(index, 12) * 45}ms` }}
      className="min-w-0 animate-[pop_0.4s_ease-out_both] lg:grid lg:grid-cols-[minmax(0,1fr)_min(17rem,32%)] lg:items-start lg:gap-8 xl:grid-cols-[minmax(0,1fr)_min(20rem,28%)] xl:gap-10"
    >
      <div className="relative min-w-0 overflow-hidden rounded-xl border border-edge bg-ink">
        <EntryCarousel
          submission={submission}
          active={carousel.active}
          image={carousel.image}
          hasCarousel={carousel.hasCarousel}
          showSlide={carousel.showSlide}
          imageClassName="block w-full"
        />
      </div>

      <aside className="mt-4 min-w-0 lg:sticky lg:top-20 lg:mt-0 lg:pt-1">
        <JudgeEntryMeta submission={submission} isJudge={isJudge} myRating={myRating} />
      </aside>
    </article>
  );
}
