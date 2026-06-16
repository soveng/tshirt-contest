import { useEffect, useMemo, useState } from "react";
import { use$ } from "applesauce-react/hooks";

import { accounts, eventStore } from "./nostr";
import {
  CONTEST_UNTIL,
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
      .filter((note) => note.created_at <= CONTEST_UNTIL)
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

const EMPTY_SCORE: SubmissionScore = { average: null, count: 0, byJudge: {} };

/** Per-submission judge scores from kind-1985 label events. */
export function useSubmissionScores(): Map<string, SubmissionScore> {
  const ratings = use$(
    () => eventStore.timeline({ kinds: [1985], authors: JUDGE_PUBKEYS, "#L": [RATING_NAMESPACE] }),
    [],
  );

  return useMemo(() => scoreSubmissions(ratings ?? []), [ratings]);
}

/** Sort rated entries by average with competition ranks (ties share rank). */
export function sortLeaderboard(
  submissions: Submission[],
  scores: Map<string, SubmissionScore>,
): RankedSubmission[] {
  const rated = submissions
    .map((submission) => ({
      submission,
      score: scores.get(submission.id) ?? EMPTY_SCORE,
    }))
    .filter((item) => item.score.average !== null);

  rated.sort((a, b) => {
    const avgDiff = b.score.average! - a.score.average!;
    if (avgDiff !== 0) return avgDiff;
    const countDiff = b.score.count - a.score.count;
    if (countDiff !== 0) return countDiff;
    return b.submission.createdAt - a.submission.createdAt;
  });

  let rank = 0;
  let prevAverage: number | null = null;
  return rated.map((item, index) => {
    if (item.score.average !== prevAverage) {
      rank = index + 1;
      prevAverage = item.score.average;
    }
    return { ...item, rank };
  });
}

/** Rated entries sorted by score for the results page. */
export function useLeaderboard(): { leaderboard: RankedSubmission[]; winners: RankedSubmission[]; rest: RankedSubmission[] } {
  const submissions = useSubmissions();
  const scores = useSubmissionScores();

  return useMemo(() => {
    const leaderboard = sortLeaderboard(submissions, scores);
    return {
      leaderboard,
      winners: leaderboard.slice(0, 3),
      rest: leaderboard.slice(3),
    };
  }, [submissions, scores]);
}

/** Entries with judge scores for the judging page (newest-first order). */
export function useRankedSubmissions(): RankedSubmission[] {
  const submissions = useSubmissions();
  const scores = useSubmissionScores();

  return useMemo(
    () =>
      submissions.map((submission, index) => ({
        submission,
        score: scores.get(submission.id) ?? EMPTY_SCORE,
        rank: index + 1,
      })),
    [submissions, scores],
  );
}
