import { JUDGE_PUBKEYS } from "../config";
import type { SubmissionScore } from "../types";
import { StarsDisplay } from "./Stars";

export function ResultsScore({
  score,
  starSize = 16,
}: {
  score: SubmissionScore;
  starSize?: number;
}) {
  if (score.average === null) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <StarsDisplay value={score.average} size={starSize} />
      <span className="font-mono text-xs text-muted">
        {score.average.toFixed(1)} · {score.count}/{JUDGE_PUBKEYS.length} judges
      </span>
    </div>
  );
}
