import { useMemo } from "react";
import { use$ } from "applesauce-react/hooks";

import { accounts, eventStore } from "./nostr";
import { HASHTAG, JUDGE_PUBKEYS, JUDGE_SET, RATING_NAMESPACE } from "./config";
import { scoreSubmissions } from "./ratings";
import { toSubmission } from "./submissions";
import type { Submission, SubmissionScore } from "./types";

export interface RankedSubmission {
  submission: Submission;
  score: SubmissionScore;
  rank: number;
}

/** The currently active account, or undefined when logged out */
export function useActiveAccount() {
  return use$(accounts.active$);
}

/** Is the logged-in user one of the contest judges */
export function useIsJudge(): boolean {
  const account = useActiveAccount();
  return !!account && JUDGE_SET.has(account.pubkey);
}

/** Reactive profile content for a pubkey */
export function useProfile(pubkey: string | undefined) {
  return use$(() => (pubkey ? eventStore.profile(pubkey) : undefined), [pubkey]);
}

/** All valid submissions, plus their judge scores, ranked for display */
export function useRankedSubmissions(): RankedSubmission[] {
  const notes = use$(() => eventStore.timeline({ kinds: [1], "#t": [HASHTAG] }), []);
  const ratings = use$(
    () => eventStore.timeline({ kinds: [1985], authors: JUDGE_PUBKEYS, "#L": [RATING_NAMESPACE] }),
    [],
  );

  return useMemo(() => {
    const submissions = (notes ?? [])
      .map(toSubmission)
      .filter((s): s is Submission => s !== null);

    const scores = scoreSubmissions(ratings ?? []);
    const empty: SubmissionScore = { average: null, count: 0, byJudge: {} };

    const ordered = submissions
      .map((submission) => ({ submission, score: scores.get(submission.id) ?? empty }))
      .sort((a, b) => {
        const avgA = a.score.average ?? -1;
        const avgB = b.score.average ?? -1;
        if (avgB !== avgA) return avgB - avgA;
        if (b.score.count !== a.score.count) return b.score.count - a.score.count;
        return a.submission.createdAt - b.submission.createdAt;
      });

    return ordered.map((item, index) => ({ ...item, rank: index + 1 }));
  }, [notes, ratings]);
}
