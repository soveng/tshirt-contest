import { useEffect, useMemo, useState } from "react";
import { use$ } from "applesauce-react/hooks";

import { accounts, eventStore } from "./nostr";
import {
  entryTimelineFilters,
  EXCLUDED_AUTHOR_PUBKEYS,
  EXCLUDED_ENTRY_IDS,
  JUDGE_PUBKEYS,
  JUDGE_SET,
  RATING_NAMESPACE,
} from "./config";
import { scoreSubmissions } from "./ratings";
import { hasVideo, toSubmission } from "./submissions";
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

/**
 * Confirmed contest entries, newest first. No ratings — for the public gallery.
 *
 * An entry is any note that tags the official account or carries the contest
 * hashtag (plus the manual allowlist), as long as it has an image and is not
 * authored by an excluded account.
 */
export function useSubmissions(): Submission[] {
  const notes = use$(
    () => eventStore.timeline(entryTimelineFilters()),
    [],
  );

  return useMemo(() => {
    return (notes ?? [])
      .filter((note) => !EXCLUDED_AUTHOR_PUBKEYS.has(note.pubkey))
      .filter((note) => !EXCLUDED_ENTRY_IDS.has(note.id))
      .filter((note) => !hasVideo(note))
      .map(toSubmission)
      .filter((submission) => submission.images.length > 0)
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [notes]);
}

/** True while entry notes are still syncing from relays. */
export function useEntriesLoading(): boolean {
  const submissions = useSubmissions();
  const [deadlinePassed, setDeadlinePassed] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setDeadlinePassed(true), 6000);
    return () => window.clearTimeout(id);
  }, []);

  if (submissions.length > 0) return false;
  return !deadlinePassed;
}

/** Entries with judge scores for the judging page. */
export function useRankedSubmissions(): RankedSubmission[] {
  const submissions = useSubmissions();

  const ratings = use$(
    () => eventStore.timeline({ kinds: [1985], authors: JUDGE_PUBKEYS, "#L": [RATING_NAMESPACE] }),
    [],
  );

  return useMemo(() => {
    const scores = scoreSubmissions(ratings ?? []);
    const empty: SubmissionScore = { average: null, count: 0, byJudge: {} };

    return submissions.map((submission, index) => ({
      submission,
      score: scores.get(submission.id) ?? empty,
      rank: index + 1,
    }));
  }, [submissions, ratings]);
}
