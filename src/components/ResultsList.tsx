import type { RankedSubmission } from "../hooks";
import { Author } from "./Author";
import { EntryDateLink } from "./EntryDateLink";
import { ResultsScore } from "./ResultsScore";

export function ResultsList({ items }: { items: RankedSubmission[] }) {
  if (items.length === 0) return null;

  return (
    <ol className="divide-y divide-edge/70 rounded-xl border border-edge bg-panel-2">
      {items.map((item) => {
        const { submission, score, rank } = item;
        const image = submission.images[0];

        return (
          <li
            key={submission.id}
            className="flex items-center gap-3 px-3 py-3 sm:gap-4 sm:px-4 sm:py-3.5"
          >
            <span className="w-6 shrink-0 text-center font-mono text-sm text-muted">{rank}</span>
            <img
              src={image}
              alt=""
              className="h-12 w-12 shrink-0 rounded-lg border border-edge object-cover sm:h-14 sm:w-14"
            />
            <div className="min-w-0 flex-1 space-y-1.5">
              <Author pubkey={submission.pubkey} size={22} />
              <ResultsScore score={score} />
            </div>
            <EntryDateLink submission={submission} compact />
          </li>
        );
      })}
    </ol>
  );
}
