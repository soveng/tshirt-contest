import { useMemo } from "react";
import { use$ } from "applesauce-react/hooks";

import { accounts, eventStore } from "./nostr";
import {
  EXTRA_ENTRY_IDS,
  JUDGE_PUBKEYS,
  JUDGE_SET,
  OFFICIAL_PUBKEY,
  RATING_NAMESPACE,
} from "./config";
import { scoreSubmissions } from "./ratings";
import { acknowledgedSubmissionId, toSubmission } from "./submissions";
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

/** All confirmed entries with judge scores. Entries are always shown in submission order so the grid doesn't leak results. */
export function useRankedSubmissions(): RankedSubmission[] {
  // Acknowledgement notes from the official account confirm which notes are entries
  const acks = use$(() => eventStore.timeline({ kinds: [1], authors: [OFFICIAL_PUBKEY] }), []);

  const entryIds = useMemo(() => {
    const ids = new Set<string>(EXTRA_ENTRY_IDS);
    for (const ack of acks ?? []) {
      const id = acknowledgedSubmissionId(ack);
      if (id) ids.add(id);
    }
    return [...ids];
  }, [acks]);

  // The entry notes themselves, loaded on demand by the ingest layer
  const notes = use$(
    () => (entryIds.length ? eventStore.timeline({ ids: entryIds }) : undefined),
    [entryIds.join(",")],
  );

  const ratings = use$(
    () => eventStore.timeline({ kinds: [1985], authors: JUDGE_PUBKEYS, "#L": [RATING_NAMESPACE] }),
    [],
  );

  return useMemo(() => {
    const submissions: Submission[] = (notes ?? [])
      .filter((note) => note.pubkey !== OFFICIAL_PUBKEY)
      .map(toSubmission);

    const scores = scoreSubmissions(ratings ?? []);
    const empty: SubmissionScore = { average: null, count: 0, byJudge: {} };

    const ordered = submissions
      .map((submission) => ({ submission, score: scores.get(submission.id) ?? empty }))
      .sort((a, b) => a.submission.createdAt - b.submission.createdAt);

    return ordered.map((item, index) => ({ ...item, rank: index + 1 }));
  }, [notes, ratings]);
}
