import { useState } from "react";

import { publishRating } from "../ratings";
import type { Submission } from "../types";
import { StarsInput } from "./Stars";

/** A judge's star input for one entry, handling signing and publishing */
export function RateStars({
  submission,
  myRating,
  size = 30,
  spread = false,
}: {
  submission: Submission;
  myRating: number | undefined;
  size?: number;
  spread?: boolean;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function rate(stars: number) {
    setPending(true);
    setError(null);
    try {
      await publishRating(submission, stars);
    } catch {
      setError("Could not publish");
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <StarsInput value={myRating ?? 0} onRate={rate} disabled={pending} size={size} spread={spread} />
      {error && <p className="mt-1 font-mono text-[11px] text-flame-soft">{error}</p>}
    </div>
  );
}
