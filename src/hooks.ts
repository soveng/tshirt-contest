import { useEffect, useMemo, useState } from "react";
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

function useEntryIds(): string[] {
  const acks = use$(() => eventStore.timeline({ kinds: [1], authors: [OFFICIAL_PUBKEY] }), []);

  return useMemo(() => {
    const ids = new Set<string>(EXTRA_ENTRY_IDS);
    for (const ack of acks ?? []) {
      const id = acknowledgedSubmissionId(ack);
      if (id) ids.add(id);
    }
    return [...ids];
  }, [acks]);
}

/** Confirmed contest entries, newest first. No ratings — for the public gallery. */
export function useSubmissions(): Submission[] {
  const entryIds = useEntryIds();

  const notes = use$(
    () => (entryIds.length ? eventStore.timeline({ ids: entryIds }) : undefined),
    [entryIds.join(",")],
  );

  return useMemo(() => {
    return (notes ?? [])
      .filter((note) => note.pubkey !== OFFICIAL_PUBKEY)
      .map(toSubmission)
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [notes]);
}

/** True while entry notes are still syncing from relays. */
export function useEntriesLoading(): boolean {
  const entryIds = useEntryIds();
  const submissions = useSubmissions();
  const acks = use$(() => eventStore.timeline({ kinds: [1], authors: [OFFICIAL_PUBKEY] }), []);
  const notes = use$(
    () => (entryIds.length ? eventStore.timeline({ ids: entryIds }) : undefined),
    [entryIds.join(",")],
  );
  const [deadlinePassed, setDeadlinePassed] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setDeadlinePassed(true), 6000);
    return () => window.clearTimeout(id);
  }, []);

  if (submissions.length > 0) return false;
  if (deadlinePassed) return false;

  const loadedCount = notes?.length ?? 0;
  const ackCount = acks?.length ?? 0;

  if (entryIds.length > 0 && loadedCount < entryIds.length) return true;
  if (loadedCount === 0 && ackCount === 0) return true;

  return false;
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
