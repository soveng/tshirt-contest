import type { RankedSubmission } from "../hooks";
import { Author } from "./Author";
import { RateStars } from "./RateStars";
import { StarsDisplay } from "./Stars";

function RankChip({ rank, rated }: { rank: number; rated: boolean }) {
  const isPodium = rated && rank <= 3;
  return (
    <span
      className={`flex h-7 min-w-7 items-center justify-center rounded-full px-2 font-mono text-xs font-bold ${
        isPodium ? "bg-flame text-ink" : "bg-ink/70 text-muted backdrop-blur-sm"
      }`}
    >
      {rated ? `#${rank}` : "—"}
    </span>
  );
}

export function SubmissionCard({
  item,
  index,
  blind,
  viewerPubkey,
  onOpen,
}: {
  item: RankedSubmission;
  index: number;
  blind: boolean;
  viewerPubkey?: string;
  onOpen: () => void;
}) {
  const { submission, score } = item;
  const rated = score.average !== null;
  const myRating = viewerPubkey ? score.byJudge[viewerPubkey] : undefined;

  return (
    <div
      style={{ animationDelay: `${Math.min(index, 12) * 45}ms` }}
      className="group flex animate-[pop_0.4s_ease-out_both] flex-col overflow-hidden rounded-xl border border-edge bg-panel transition-all duration-200 hover:border-flame/60 hover:shadow-[0_12px_40px_-12px_rgba(247,147,26,0.35)] sm:hover:-translate-y-1"
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label="Open entry"
        className="relative block aspect-[4/5] w-full cursor-pointer overflow-hidden bg-panel-2"
      >
        {submission.images.length > 0 ? (
          <img
            src={submission.images[0]}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <p className="flex h-full w-full items-center justify-center p-4 text-center text-sm text-muted">
            {submission.content.slice(0, 140) || "No preview"}
          </p>
        )}
        {!blind && (
          <div className="absolute top-2.5 left-2.5">
            <RankChip rank={item.rank} rated={rated} />
          </div>
        )}
        {submission.images.length > 1 && (
          <span className="absolute right-2.5 bottom-2.5 rounded-full bg-ink/70 px-2 py-0.5 font-mono text-[10px] text-neutral-300 backdrop-blur-sm">
            +{submission.images.length - 1}
          </span>
        )}
      </button>

      <div className="flex flex-col gap-2 px-3 py-2.5">
        <div className="flex items-center justify-between gap-2">
          <Author pubkey={submission.pubkey} size={26} />
          {!blind &&
            (rated ? (
              <div className="flex shrink-0 flex-col items-end">
                <StarsDisplay value={score.average!} size={13} />
                <span className="font-mono text-[10px] text-muted">
                  {score.average!.toFixed(1)} · {score.count}/4
                </span>
              </div>
            ) : (
              <span className="shrink-0 font-mono text-[10px] text-muted">unrated</span>
            ))}
        </div>

        {blind && (
          <div className="border-t border-edge/60 pt-2">
            <RateStars submission={submission} myRating={myRating} size={22} spread />
          </div>
        )}
      </div>
    </div>
  );
}
